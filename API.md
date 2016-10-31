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
  - [Sql.Box()](#sqlbox)
  - [Sql.connect()](#sqlconnectuser-pass-database-host)
  - [Sql.query()](#sqlqueryquery-query_params-callback)
  - [Sql.replyQuery()](#sqlreplyqueryres-query-query_params)
  
### Class VirtualDrive
  - [VirtualDrive.Box()](#virtualdriveboxserver-root)
  - [VirtualDrive.onUpload()](#virtualdriveonuploadurl-dir-props-callback)

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

## Sql
This class connects to MySQL database and allow you to stream queries (via mysql module).

### Sql.Box()
Constructor.

###### Example:
```JavaScript
const web = require('webbox');
var sql = new web.Sql.Box();
```

### Sql.connect(\<user>, \<pass>, \<database>, [host])
Connects to MySQL-database on \<host> as \<user>.

| Argument | Type | Description |
| --- | --- | --- |
| user | String | User name. |
| pass | String | User password. |
| database | String | Database name. |
| host | String | **OPTIONAL.** Database host (default: localhost) |

###### Example:
```JavaScript
sql.connect('badkitten', 'kittenrulezz', 'kitdb');
```

### Sql.query(\<query>, [query_params], \<callback>)
Sends MySQL-query to connected database.
Returns (Object) result of query.

| Argument | Type | Description |
| --- | --- | --- |
| query | String | SQL-query. |
| query_params | Object | **OPTIONAL.** Parameters, which will be add to query (Read npm mysql documentation). |
| callback | Function | Callback-function. Contains \<result> of query in arguments. |

###### Example:
```JavaScript
server.onPost('/getUser', function(req, res) {
  var query = "SELECT * FROM users WHERE ?";
  var query_params = {
    uid: 1337
  };
  
  // Send SQL-query
  sql.query(query, query_params, function(result){
    server.sendJSON(result);
  });
});
```

###### Example of result:
```JavaScript
{"status":1,"rows":[{"id":1,"uid":1337,"name":"Alexander","lastname":"Witness","age":20}],"fields":[{"catalog":"def","db":"webbed_test","table":"users","orgTable":"users","name":"id","orgName":"id","charsetNr":63,"length":2,"type":3,"flags":16899,"decimals":0,"zeroFill":false,"protocol41":true},{"catalog":"def","db":"webbed_test","table":"users","orgTable":"users","name":"uid","orgName":"uid","charsetNr":63,"length":6,"type":3,"flags":4097,"decimals":0,"zeroFill":false,"protocol41":true},{"catalog":"def","db":"webbed_test","table":"users","orgTable":"users","name":"name","orgName":"name","charsetNr":33,"length":66,"type":253,"flags":4097,"decimals":0,"zeroFill":false,"protocol41":true},{"catalog":"def","db":"webbed_test","table":"users","orgTable":"users","name":"lastname","orgName":"lastname","charsetNr":33,"length":66,"type":253,"flags":4097,"decimals":0,"zeroFill":false,"protocol41":true},{"catalog":"def","db":"webbed_test","table":"users","orgTable":"users","name":"age","orgName":"age","charsetNr":63,"length":2,"type":3,"flags":4097,"decimals":0,"zeroFill":false,"protocol41":true}]}
```
Don't panic. (: You can find more info [here.](https://github.com/mysqljs/mysql)

### Sql.replyQuery(\<res>, \<query>, [query_params])
Similar to Sql.query(), but this method no need for callback. When SQL-query ends, it will automatically send response to client in JSON-format. (via \<res> object).

| Argument | Type | Description |
| --- | --- | --- |
| res | Object | Response object. |
| query | String | SQL-query. |
| query_params | Object | **OPTIONAL.** Parameters, which will be add to query. |

###### Example:
```JavaScript
server.onPost('/getUser', function(req, res) {
  var query = "SELECT * FROM users WHERE ?";
  var query_params = {
    uid: 1337
  };
  
  // Send SQL-query
  sql.replyQuery(res, query, query_params);
});
```

## VirtualDrive
This class can help upload files to your server.

### VirtualDrive.Box(\<server>, \<root>)
Constructor.
Creates virtual drive at \<root> directory.
If \<root> folder doesn't exists, it will be automatically created.

| Argument | Type | Description |
| --- | --- | --- |
| server | Object | An instance of server class. |
| root | String | Where is your Virtual Drive root. |

###### Example:
```JavaScript
const web = require('webbox');
var vd = new web.VirtualDrive.Box(server, 'mydrive/');
```

### VirtualDrive.onUpload(\<url>, \<dir>, \<props>, \<callback>)
Sets a listener for all upload events, which made via POST-request.

| Argument | Type | Description |
| --- | --- | --- |
| url | String | Request url (for example, localhost:3000**/uploadFile** . |
| dir | String | Where is your will be saved (at drive root). If dir folder doesn't exists, you'll get an error. |
| props | Object | Some settings for uploading files (see next). |
| callback | Function | Your callback. Can pass 1 argument \<result>(Object). |

###### Example:
```JavaScript
var properties = {
    maxSize: 5*1024*1024, // 5 MB
    fileTypes: ['image/jpeg','image/png', 'image/gif','image/bmp'],
    maxNameLength: 4
};

vd.onUpload('/uptest', '/photos', properties, function(req, res, result){
    server.sendJSON(res, result);
});
```

##### Properties
| Name | Type | Description |
| --- | --- | --- |
| maxSize | Integer | Max file size in bytes. |
| fileTypes | Array | Array of avaliable for upload MIME-types (you can find it [here](http://www.iana.org/assignments/media-types/media-types.xhtml)). |
| maxNameLength | Integer | Max length of file name, which will be generated. |
