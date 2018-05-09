/*
 * Prime File for the api guy
 *
 */
 //Dependency
 // requiring the built in node http server module

 const http = require('http');
 const url = require('url');


//server should respond to all request with a string

const server = http.createServer(function(req,res){


//get the url
const parseUrl = url.parse(req.url,true);

//get the path let me know what path the request came from 
 
const path = parseUrl.pathname;

//lets trim path keep it clean dude!!!

const trimmedPath = path.replace(/^\/+|\/+$/g,'');

//Give me the http method please 

const method = req.method.toLowerCase();


//Give me the query string 

const queryString = parseUrl.query;

//send a response

  res.end('hello\n');

//log the clients requested path
console.log('the request is recieved on this path ',trimmedPath+ ' and  with this method =  '+ method + ' with this query string ', queryString)


})









 // start the server and have it listen on to port 3000 

server.listen(3000,function(){
	console.log('server is listening on port 30000');
})

