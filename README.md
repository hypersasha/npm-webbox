# WebBox
NPM module, which can help you to setup your first NodeJS server, based on Express, MySQL and Multiparty modules.

### Version
Current version of WebBox is 0.0.9 (Alpha)

### Table of Contents
- [Install](#installing)
- [Run first server](#running-your-first-server)
- [Handling requests](#handling-a-GET/POST-requests)

### Installing
Add WebBox to your project with npm:

```
npm install webbox
```

## Running your first server
To run your first server at port 3000, just add this code into your **index.js**

```JavaScript
const web = require('webbox');
var server = new web.Server.Box();

server.createServer(3000);
```

## Handling a GET/POST-requests
For example, if you want to handle a POST-request, you should use _server.onPost()_ method in your **index.js**
```JavaScript
server.onPost('/test', function(req,res) {
  res.status(200).send("Hello!");
}
```

## Create a server root
You also can set the root of your server.
You also can set root of your server. Just make some folder in your project (./www, for example), add an **index.html** file with some markup and then modify your **index.js**
```JavaScript
server.setServerRoot('www/');
```
Done! Just go to localhost:3000/ and you'll see magic. :smile:


