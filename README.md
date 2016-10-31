# WebBox
NPM module, which can help you to setup your first NodeJS server, based on Express, MySQL and Multiparty modules.

### Installing
Add WebBox to your project with npm:

```
npm install webbox
```

## Running your first server
To run your first server at port 3000, just add this code into your index.js

```
const web = require('webbox');
var server = new web.Server.Box();

server.createServer(3000);
```
