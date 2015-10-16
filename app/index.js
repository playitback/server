// Initialize global parameters
process.env.NAME = process.env.ENV || 'dev';

// Libraries
var DI = require('./lib/di');

// Initialise DI
var container = new DI(__dirname);

// Initialize required services
container.get('model');
container.get('server').listen(3030);
container.get('router');

// Check for a test
if(typeof test != 'undefined') {
    // Make the test accessible to dependencies
	container.extend(test);
	
	test.run();
}