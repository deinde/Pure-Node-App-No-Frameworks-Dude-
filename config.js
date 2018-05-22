/*
* Create and export configuration variables
* 
*/

// Creating a container for all enviroments 
let enviroments = {};


// staging {default} enviroment

//also making two different eviroments for http and https servers

enviroments.staging = {
	'httpPort':3000,
	'httpsPort':3001,
	'envName':'staging'

}


// production eviroment 

enviroments.production ={
	'httpPort':5000,
	'httpsPort':5001,
	'envName':'production'

}

//Determine which enviroment was passed as a command line argument if any. Aka did
//the person running it use staging, or production. What if the use something else.
//If they did, then default to an empty string. Basically first find out if they passed 
//something with a string, if so then use that


let currentEnviroment = typeof(process.env.NODE_ENV) == 'string'? process.env.NODE_ENV.toLowerCase() : ''; 

//here a string of some sort has been passed, now lets look further to see if that 
//string is one of the defined enviroment above
//Check to see if the enviroment is one of the defined ones above. If not set it default to 
//enviroments.staging 

let enviromentToExport = typeof(enviroments[currentEnviroment]) == 'object'? enviroments[currentEnviroment] : enviroments.staging;


module.exports  = enviromentToExport;