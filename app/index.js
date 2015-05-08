// Initialise DI
var container = new require('./lib/di')();

// Initialize external parameters
//this.env = process.env.ENV || 'dev';

// Initialize required services
container.get('server').listen(3030);
container.get('router');

// Check for a test
if(typeof test != 'undefined') {
    // Make the test accessible to dependencies
	container.extend(test);
	
	test.run();
}