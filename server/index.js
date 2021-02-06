const express = require('express'),
	fs = require('fs'),
	path = require('path'),
	WebSocket = require('ws'),
	reQL = require('./scripts/reQL'),
	config = require('./config'),
	saveTopicIncrementing = require('./scripts/saveTopicIncrementing.js'),
	gql = require('graphql-tag'),
	{ graphqlHTTP } = require('express-graphql');



const app = express();

const schema = gql`
type Query {
  me: User
}
 
type User {
  id: ID
  name: String
}
`;
app.use('/graphql', graphqlHTTP({
	schema: schema,
	graphiql: true,
	context: async () => {
			return {db: reQL.connectToDB()}
	}
}))

// Function for incrementing filename when saving it, if it already exists
const writeFileIncrementing = (filename, data, increment = 0) => {
	const name = `${path.basename(filename, path.extname(filename))}${increment || ""}${path.extname(filename)}`;
	return fs.promises.writeFile(path.join(path.dirname(filename), name), data, { encoding: 'utf8', flag: 'wx' }).catch(ex => {
	  if (ex.code === "EEXIST") return writeFileIncrementing(filename, data, ++increment);
	  throw ex;
	});
  }



app.use(express.json());


// Set homepage
app.get('/', (req, res) => {
	let allTopics = [],
		dirname = path.join(__dirname, '/model/topicscache/');

	// Check if it's a private information
	if (req.body.private) dirname = path.join(__dirname, '/model/private/topicscache');

	fs.promises.readdir(dirname, 'utf8')
		.then(
			topicIds => {
				const topicsContents = [];
				for (const name of topicIds) {
					if (name === '.gitignore') continue;
					topicsContents.push(fs.promises.readFile(path.join(dirname, name), 'utf8'));
				}
				return Promise.all(topicsContents);
			}
		)
		.then(
			topicsContents => {
				allTopics = topicsContents;
				return fs.promises.readFile(path.join(__dirname, '/public/index.html'), 'utf8');
			}
		)
		.then(
			page => {
			// SECURITY ALERT!
			// VERY UNSAFE!!! Attacker can manipulate entry here
			// Check needs to happen in the server (but rather on input), because HTML parser runs first than browser JS
				console.log(allTopics)
				const allTopicsBadlySanitized = ('[' + allTopics.join() + ']').replace(/[<>]/g, (char) => char === '<' ? '&lt;' : '&gt;');
				res.send(page.replace(/<body>/i, '<body><x-server-data id="x-server-data" class="hidden">' + allTopicsBadlySanitized + '</x-server-data>'));
			}
		)
		.catch(
			(err) => res.status(err.statusCode || 500).send(err)
		);
});

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));
// hack (while there's no webpack): add path to node module 
app.get('/purify.min.js', function(req, res) {
	res.sendFile(__dirname + '/node_modules/dompurify/dist/purify.min.js');
});

// API

app.get('/topic/:topicId', (req, res, next) => {
	const topicId = req.params.topicId;

	let location = path.join(__dirname, '/model/topicscache/', topicId);
	// Check if it's a private information
	if (req.body.private) location = path.join(__dirname, '/model/private/topicscache/', topicId);
	
	return fs.promises.readFile(location, 'utf8')
		.then(contents => res.send(contents))
		.catch(next);
});

// This here is weird, for REST this should be GET instead of POST. But GET has char limit
// This is all temporary anyway since I'll use a database afterwards
app.post('/api/infos/', (req, res, next) => {
	const infos = req.body;
	if (!Array.isArray(infos)) throw new Error('type is not Array');

	let dirname = path.join(__dirname, '/model/infos/');

	// Check if it's a private information
	if (req.body.private) dirname = path.join(__dirname, '/model/private/infos');

	const allPromises = [];
	for (let id of infos) {
		const location = path.join(dirname, id);
		allPromises.push(fs.promises.readFile(location, 'utf8'));
	}
	Promise.all(allPromises).then(contents => res.send(contents)).catch(next);
});

app.post('/api/save/', [superBackup, saveInfo, saveTopic, updateTopicsCache], (req, res) => {
	res.sendStatus(200);
	req.body.info ? console.log(`Success! Saved topic ${req.body.topic.topicId} and info ${req.body.info.id}`) :
		console.log(`Success! Saved topic ${req.body.topic.topicId} and no info`);
});

function superBackup(req, res, next) {
	let filename = new Date().toString().replace(/[: ]/g, (char)=> char === ':' ? '-' : '_');
	console.log(req, req.body, req.body.info);
	writeFileIncrementing(path.join(__dirname, '/superbackup/', filename), JSON.stringify(req.body))
		.then((fulfilled) => next(), (err) => next(err));
}

function saveInfo(req, res, next) {
	const info = req.body.info,
		filename = info?.id,
		infoString = JSON.stringify(info);

	let dirname = path.join(__dirname, '/model/infos/', filename);
	// Check if it's a private information
	if (req.body.private) dirname = path.join(__dirname, '/model/private/infos', filename);

	if (!info) return next();
	fs.promises.writeFile(dirname, infoString, {flag: 'wx'})
		.then((fulfilled) => next(), (err) => next(err));
}

function saveTopic(req, res, next) {
	let topic = req.body.topic,
		filename = topic.topicId,
		dirname = path.join(__dirname, '/model/topics', filename);

	// Check if it's a private information
	if (req.body.private) dirname = path.join(__dirname, '/model/private/topics', filename);

	topic = JSON.stringify(topic);
	// If folder doesn't exist, create it
	// No need to set folder to 0755, because umask already converts 0777 to 0755
	fs.mkdir(dirname, (err) => {
		topic.timestamp = new Date().getTime();
		if (err) {
			if (err.code === 'EEXIST') {
				// fs.promises.writeFile(path.join(dirname, filename), order, {flag: 'wx'}).catch(next);
				return saveTopicIncrementing(dirname, filename, JSON.stringify(req.body))
					.then((fulfilled) => next(), (err) => next(err));
			}
			else {
				next(err);
			}
		}
		// If no error:
		else {
			return saveTopicIncrementing(dirname, filename, JSON.stringify(req.body))
				.then((fulfilled) => next(), (err) => next(err));
		}
	});
}

function updateTopicsCache(req, res, next) {
	let topic = req.body.topic,
		filename = topic.topicId,
		dirname = path.join(__dirname, '/model/topicscache/', filename);
	
	topic = JSON.stringify(topic);

	// Check if it's a private information
	if (req.body.private) dirname = path.join(__dirname, '/model/private/topicscache', filename);

	return fs.promises.writeFile(dirname, topic, {flag: 'w'})
		.then((fulfilled) => next(), (err) => next(err));
}

// Error handler
app.use((err, req, res, next) => {
	console.log(req);
	console.log(req.body);
	console.log(err.statusCode);
	console.error(err.stack);
	//res.status(err.statusCode || 500).send({error: err, message: err.message});
	next(err); // uses Express default error handler
});

// Because of nginx, I think it's ok to omit host here
const server = app.listen(config.WEB_PORT, () => {
	console.log(`Listening on port ${config.WEB_PORT}`);
	console.log(`🚀 Check out the GraphQL Playground @ http://localhost:${config.WEB_PORT}/graphql`)

});


// WebSocket
// 
// EventEmitter for ws
const EventEmitter = require('events'),
	wsemitter = new EventEmitter();


// Create WebSocket
const wsserver = new WebSocket.Server({
	server: server,  // server:server connects to the express server 'app.listen', named 'server'
	backlog: 100,
	clientTracking: true
});

wsserver.on('connection', function connection(ws) {
	// nginx proxy_read_timeout defaults to 1 min, it closes the connection if nothing is by the server
	// because it's possible that the connection is closed and nodejs doesn't know it, it makes sense
	// to implement ping/pong to also keep the connection alive
	ws.isAlive = true;
	ws.on('pong', function() {this.isAlive = true}); // must not be arrow function, otherwise 'this' won't work
	// ping will be sent below, to all connections

	ws.send('apagar connected '+ new Date());
	
	const wsemitterFunction = (change) => {
		ws.send(change);
	};

	// EventEmitter adds the same function over and over, even if it's a named function, so we must check if it has been added already
	const added = {};

	ws.on('message', function incoming(topicId) {
		if (!added[topicId]) {
			wsemitter.on(topicId, wsemitterFunction);
			added[topicId] = true;
		}
		ws.send('received, time ' + new Date());
	});
		
	ws.on('close', () => {
		for (let topicId in added) {
			wsemitter.off(topicId, wsemitterFunction);
		}
	});
});

const interval = setInterval(function ping() {
	wsserver.clients.forEach(function each(ws) {
		if (ws.isAlive === false) return ws.close(4000, 'did not receive a ping on time');
  
	  	ws.isAlive = false;
	  	ws.ping();
	});
}, 45000);
