async function readTitles(appRoot) {
	const fs = require('fs'),
		path = require('path'),
		baseDir = path.join(appRoot || __dirname, '/titles/');
		//errorFunc = (err) => console.error(err);
		
	// Get the latest files (i.e., the ones that have the greatest number appended to them) from each title folder
	let latestFiles = await fs.promises.readdir(baseDir)
		.then(
            async function(res) {
				const latestFiles = [];

				for (let dir of res) {
					dir = path.join(baseDir, dir);
                    let files = await fs.promises.readdir(dir),
                        result = '';

					for (let name of files) {
						name = path.join(dir, name);
						if ((name.length < result.length) || (name.length === result.length && name < result)) continue;
						result = name;
					}

					latestFiles.push(result);
				}

				return latestFiles;
			}
		)
		
		//.catch(errorFunc);
	
    const allPromises = [];
    
	for (let file of latestFiles) {
        const p = new Promise(
            (resolve, reject) => {
                fs.promises.readFile(file, 'utf8').then(content => resolve([file, content]));
            }
        );
        allPromises.push(p)
    }
    
    // format for filesContents is [[filename1, file1Content], [filename2, file2Content], ...
    const filesContents = Promise.all(allPromises).then(result => result);
    return filesContents;
}

module.exports = readTitles;
// Remember: this function returns a promise; .then has to be used to access contents