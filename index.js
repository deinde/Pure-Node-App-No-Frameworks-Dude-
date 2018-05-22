/*
 * Prime File for the api guy
 *
 */
 //Dependency
 // requiring the built in node http server module

 const http = require('http');

 // requiring the built in node url module


 const url = require('url');

 // requiring build in node modulde string_decoder to parse user payloads

 const StringDecoder = require('string_decoder').StringDecoder;


 const config = require('./config');

//server should respond to all request with a string

const server = http.createServer(function(req,res){


//get the url 
// pass the req.url object into 'url.parse' method  and return object 
//with keys and values to neatly
// work with and set to  variable called 'parseUrl'
// const parseUrl = url.parse(req.url,true);

 var parsedUrl = url.parse(req.url, true);



//get the path name of the request from the url object called
// 'parseUrl' and access the property key called 'pathname'
//to get the requsts path name
var path = parsedUrl.pathname;


//lets trim path make it pretty and keep it clean dude!!!

var trimmedPath = path.replace(/^\/+|\/+$/g,'');

console.log('CHECKING THE PARSED URL trimmed!!!!!!!',path)


// var   trimmedPath = path.replace(/^\/+|\/+$/g, '');


//Give me the http method please 

const method = req.method.toLowerCase();

// Get the request headers object inside the req object as an object 

const headers = req.headers;

//Give me the query string  from url.parse object set to var parseUrl and go
//to key word property called 'query'
const queryString = parsedUrl.query;

//create a ne decoder to handle incoming streams that contain payloads
const decoder = new StringDecoder('utf-8');
//since streams come in bits and peices, we need a place (bucket) to hold all bits
// we collect every thing when finished.
//As new data comes in, we append it to buffer until stream is done
let buffer = '';

//This is the event listener listening for the 'data' event checking to see
//if a stream of data is present on a request and append to buffer var
req.on('data',function(data){
	buffer += decoder.write(data);
//here we are choosing the handler the request shall go to

// let chosenHandler = typeof(router[trimmedPath]) !=='undefined' ? router[trimmedPath] : hanldlers.notFound;

// Check the router for a matching path for a handler. If one is not found, use the notFound handler instead.
var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handelers.notFound;



// this is the data object 
 data ={
	'trimmedPath':trimmedPath,
	'queryString':queryString,
	'method':method,
	'headers':headers,
	'payload':buffer

}


chosenHandler(data,function(statusCode,payload){
	//figure out if the status code is present. If is then give it else default
	//200
	typeof(statusCode) == 'number' ? statusCode : 200;

		//figure out if the payload is present. If is then give it else default
	//an object

	typeof(payload) ==  'object' ? payload : {};
	//convert the data object to string to send back in response
  let payloadString = JSON.stringify(payload);

  //here is the response Dude!
  //specify the json is going to be the response type to the client in the response header
  res.setHeader('Content-type','application/json');
  //writing to response object with writehead method
  res.writeHead(statusCode);

  //sending the payload with end method
  res.end(payloadString);
console.log('the returning response is :',statusCode,payloadString)
})





});


//this is the event listener listening for the end event of a data stream on a request
//the data stream is sent in the body from client!!!

req.on('end',function(){
	buffer +=  decoder.end;


	//send a response

  res.end('hello\n');

//log the clients requested path
console.log('the request is recieved on this path ',trimmedPath + ' and  with this method =  '+ method + ' with this query string ', queryString)
console.log('request recieved with these headers :',headers);
console.log('request recieved with this payload :',buffer);

})




})









 // start the server and have it listen on to port 3000 

server.listen(config.port,function(){
	console.log('server is listening on port: '+config.port+ 'right now and the enviroment is: ' + config.envName);
})

// here is all the server logic for both http and https

let handelers = {};

handelers.sample = function(data,callback){
    callback(406,{'name':'sample handler'});
}

handelers.notFound =function(data,callback){
     callback(404);
}

let router ={
	'sample':handelers.sample
}