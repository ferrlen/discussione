async function incrementIfExists(dirPath, filename, data, increment=1) {
	// This function should be async, because returning a Promise is expected
	const fs = require('fs'),
		path = require('path'),
		fileExtension = path.extname(filename);
		//errorFunc = (err) => console.error(err);
	
	// Remove extension from filename
	filename = path.basename(filename, path.extname(filename));

	// Get the last file saved with same filename (i.e., the one that has the greatest increment number), if there is one	
	let lastFile = await fs.promises.readdir(dirPath) 
		.then(files => {
			let result = '';
			
			for (const name of files) {
				if (!name.startsWith(filename)) continue;
				if ((name.length < result.length) || (name.length === result.length && name < result)) continue;
				result = name;
			}
			
			return result;
		})
		
		//.catch(errorFunc);
		
	if (lastFile) {
		const lastIncrementNr = Number(lastFile.slice((filename + '_').length));
		if (increment <= lastIncrementNr) increment = lastIncrementNr + 1;
	}
	
	filename = path.join(dirPath, filename);
	
	while (true) {
		/* let breakLoop = await fs.promises.open(lastFile ? filename : filename + '_' + increment, 'wx')
			
			.then(fd => {
				fs.write(fd, data, errorFunc);
				fs.close(fd, errorFunc);
				return true;
			})
			
			.catch(err => {
				if (err.code === 'EEXIST') {
					return false;
				}
				throw err;
			});
		
		if (breakLoop) break;
		increment++; */
		let breakLoop = await fs.promises.writeFile(lastFile ? filename + '_' + increment + fileExtension : filename + fileExtension, data, {encoding: 'utf8', flag: 'wx'})
			
			.then(fd => true)
			
			.catch(err => {
				if (err.code === 'EEXIST') {
					return false;
				}
				throw err;
			});
		
		if (breakLoop) break;
		increment++;
	}
}

module.exports = incrementIfExists;