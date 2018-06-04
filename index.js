/*
 * Prime File for the api guy
 *
 */
 //Dependency
 // requiring the built in node http server module

 const http = require('http');
 const https = require('https');

 const _data = require('./lib/data');

//test for writing to file from _data module

// _data.create('test','thirdFile',{'Wavy':'Baby!'},function(err){
// 	console.log('this was the error from writing _data :', err);
// })


//test for reading in data

// _data.read('test','secondfilemade',function(err,data){
// 	console.log('this was the error from reading _data :', err, 'and this is the data :', data);
// })

//test to update the data

// _data.update('test','thirdFile',{'New':'This data was updated Dude!!'},function(err){
	
//      console.log('this was the error :',err);

// })

//test to  delete file

//if error comes back false then file is deleted

_data.delete('test','secondfilemade',function(err){
	console.log('This was the error!',err);
})




// require the fs module to help read in my certificate and key
//from config for https secured connection
//'fs' stands for file sync . Or [read,file,sync] The keys will be read in aysnchronously
//Many node function are have either a sync or aysnc function. The one
//we are using here is sync for key.pem and cert.pem, because we need both read in 
//synchroniously


const fs = require('fs');


 // requiring the built in node url module


 const url = require('url');

 // requiring build in node modulde string_decoder to parse user payloads

 const StringDecoder = require('string_decoder').StringDecoder;


 const config = require('./config');


//create the secured server here with key and cert (instantiate it Dude!)
//server should respond to all request with a string


let httpsServerOptions ={
 key:fs.readFileSync('./https/key.pem'),
 cert:fs.readFileSync('./https/cert.pem')
}
const httpServer = http.createServer(httpsServerOptions,function(req,res){

	unifiedServer(req,res);
})



// start the server and have it listen on to which ever port is passed 

httpServer.listen(config.httpPort,function(){
	console.log('server is listening on port : '+config.httpPort+ ' right now and the enviroment is: ' + config.envName);
})


// create the https sever

const httpsServer = https.createServer(function(req,res){

   unifiedServer(req,res);
   
})



//start the https sever

httpsServer.listen(config.httpsPort,function(req,res){
  console.log('https server is now running on port '+config.httpsPort)
})










// here is all the server logic for both http and https

let unifiedServer = function(req,res){


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
	
	payload = typeof(payload) ==  'object' ? payload :{};
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
   });

});


}//end of unified function

let handelers = {};

handelers.ping = function(data,callback){
	callback(200)

}

handelers.sample = function(data,callback){
    callback(200,{'name':'sample handler'});
}

handelers.notFound =function(data,callback){
     callback(404,{});
}

let router ={
	'sample':handelers.sample,
	'ping':handelers.ping
}



