# WebBox Classes and Methods.
There is a full list of all classes and methods, which WebBox includes.

### Class Server
  - Server.Box()
  - Server.createServer()
  - Server.setServerRoot()
  - Server.onPost()
  - Server.onGet()
  - Server.sendJSON()
  
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

### Server.createServer(\<port>)
Starts server at port from arguments.

| Argument | Type | Description |
| --- | --- | --- |
| port | Integer | At which port your server should starts. |

