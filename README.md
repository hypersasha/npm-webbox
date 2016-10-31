# WebBox
NPM module, which can help you to setup your first NodeJS server, based on Express, MySQL and Multiparty modules.

### Version
Current version of WebBox is 0.0.9 (Alpha)

### Table of Contents
- [Installing](#installing)
- [Running first server](#running-your-first-server)
- [Handling requests](#handling-a-getpost-requests)
- [Creating a server root](#creating-a-server-root)
- [Allow files uploads](#allow-files-uploads)
- [More Documentation](#need-more-documentation)

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

## Creating a server root
You also can set the root of your server.
You also can set root of your server. Just make some folder in your project (./www, for example), add an **index.html** file with some markup and then modify your **index.js**

```JavaScript
server.setServerRoot('www/');
```
Done! Just go to localhost:3000/ and you'll see a magic. :smile:

## Allow files uploads
If You want to let users to upload different files to your server, you should use a VirtualDrive module.
Let's add some code to our **index.js**

```JavaScript
// Create Virtual Drive and set its root to ./YOUR_SERVER_ROOT/VD/
var vd = new web.VirtualDrive.Box(server, 'VD/');

// Now, define some properties for all uploads
var properties = {
    // Max upload file size in bytes
    maxSize: 5*1024*1024, // 5 MB
    // Avaliable file formats
    fileTypes: ['image/jpeg','image/png', 'image/gif','image/bmp'],
    // Max generated name length
    maxNameLength: 4
};

// And create an upload listener.
vd.onUpload('/uptest', '/photos', properties, function(req, res, result){
    server.sendJSON(res, result);
});
```
Done! Now you can upload images to your server via POST-requests ar localhost:3000/uptest

P.S. WebBox have a JavaScript module, which you can include to your webpage. Find out [here.](https://github.com/hypersasha/js-webbox)

## Need more documentation?
You can find the full list of WebBox classes and methods here.

