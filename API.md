# WebBox Classes and Methods.
There is a full list of all classes and methods, which WebBox includes.

### Class Server
  - [Server.Box()](#serverbox)
  - [Server.createServer()](#servercreateserverport)
  - [Server.setServerRoot()](#serversetserverrootdir)
  - [Server.onPost()](#serveronpostpath-callback)
  - [Server.onGet()](#serverongetpath-callback)
  - [Server.sendJSON()](#serversendjsonres-json-status)
  
### Class Sql
  - Sql.Box()
  - Sql.connect()
  - Sql.query()
  - Sql.replyQuery()
  
### Class VirtualDrive
  - VirtualDrive.Box()
  - VirtualDrive.onUpload()
  - VirtualDrive.onDownload()

## Server
This class creates and setup your web-server.

### Server.Box()
Constructor.

###### Example:
```JavaScript
const web = require('webbox');
var server = new web.Server.Box();
```

### Server.createServer(\<port>)
Starts server at port from arguments.

| Argument | Type | Description |
| --- | --- | --- |
| port | Integer | At which port your server should starts. |

###### Example:
```JavaScript
server.createServer(3000);
```

### Server.setServerRoot(\<dir>)
Sets the root of your server at /dir.

| Argument | Type | Description |
| --- | --- | --- |
| dir | String | Path to directory, which will be the root of server |

###### Example:
```JavaScript
server.setServerRoot('public/www/');
```

### Server.onPost(\<path>, \<callback>)
Creates a POST-request listener.

| Argument | Type | Description |
| --- | --- | --- |
| path | String | Request page, for example: localhost:3000**/hello** |
| callback | Function | User callback-function. Can accept **req** and **res** parameters. |

###### Example:
```JavaScript
server.onPost('/hello', function(req, res){
  res.status(200).send('Hello, world!');
});
```

### Server.onGet(\<path>, \<callback>)
Similar to Server.onPost()

### Server.sendJSON(\<res>, \<json>, [status])
Sends a response with JSON-formatted message.

| Argument | Type | Description |
| --- | --- | --- |
| res | Object | Object response |
| json | Object | Object with data, which will be parsed as JSON |
| status | Integer | **OPTIONAL.** Response status. As default: 200. |

###### Example:
```JavaScript
server.onPost('/hello', function(req, res){
  var data = {
    message: "Hello",
    username: "world"
  };
  server.sendJSON(res, data);
});
```

