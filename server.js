//Server Code
const app = require('http').createServer(handler)
const io = require('socket.io')(app) //wrap server app in socket io capability
const fs = require("fs") //need to read static files
const url = require("url") //to parse url strings

const PORT = process.env.PORT || 3000

let numPlayer = {
  number: -1
}
let players = {
  player1: 0,
  player2: 0
}

const ROOT_DIR = "html" //dir to serve static files from

let movingCircleLocation = {
  x: -1,
  y: -1
}

const MIME_TYPES = {
  css: "text/css",
  gif: "image/gif",
  htm: "text/html",
  html: "text/html",
  ico: "image/x-icon",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  js: "text/javascript", //should really be application/javascript
  json: "application/json",
  png: "image/png",
  svg: "image/svg+xml",
  txt: "text/plain"
}

function get_mime(filename) {
  //Get MIME type based on extension of requested file name
  //e.g. index.html --> text/html
  for (let ext in MIME_TYPES) {
    if (filename.indexOf(ext, filename.length - ext.length) !== -1) {
      return MIME_TYPES[ext]
    }
  }
  return MIME_TYPES["txt"]
}
app.listen(PORT) //start server listening on PORT
function handler(request, response) {
    var urlObj = url.parse(request.url, true, false);
    console.log("\n============================");
    console.log("PATHNAME: " + urlObj.pathname);
    console.log("REQUEST: " + ROOT_DIR + urlObj.pathname);
    console.log("METHOD: " + request.method);

    var receivedData = "";

    //attached event handlers to collect the message data
    request.on("data", function(chunk) {
      receivedData += chunk;
    });
    //event handler for the end of the message
    request.on("end", function() {
      //Handle the client POST requests
      if (request.method == "GET") {
        //handle GET requests as static file requests
        var filePath = ROOT_DIR + urlObj.pathname;
        if (urlObj.pathname === "/") filePath = ROOT_DIR + "/index.html";
        fs.readFile(filePath, function(err, data) {
          if (err) {
            //report error to console
            console.log("ERROR: " + JSON.stringify(err))
            //respond with not found 404 to client
            response.writeHead(404);
            response.end(JSON.stringify(err))
            return
          }
          response.writeHead(200, { "Content-Type": get_mime(filePath) })
          response.end(data)
        })
      }
    })
  }

  // Sends information of all rock positions to all clients
  io.on('connection', function(socket){
    socket.on('circleData', function(data){
      let dataObj = JSON.parse(data)
      movingCircleLocation = dataObj
      //to broadcast message to everyone including sender:
      io.emit('circleData', data) //broadcast to everyone including sender
    })
    socket.on('handle_player', (data)=>{
      let users = JSON.parse(data)
      //players.player1 = users.player1
      //players.player2 = users.player2
      if(users.player1 == 1){
        players.player1 = 1
      }
      if(users.player2 == 1){
        players.player2 = 1
      }
      /*if (users.player1 == 0){
        players.player1 = 0
      }
      if(users.player2 == 0){
        players.player2 = 0
      }*/
      io.emit('handle_player', JSON.stringify(players))
    });
    socket.on('player_free', (data)=>{
      let users = JSON.parse(data)
      if(users.player == 1){
        players.player1 = 0
      }else if(users.player == 2){
        players.player2 = 0
      }
      io.emit('player_free', JSON.stringify(players))
    });
    socket.on('update_player', (data)=>{
      io.emit('update_player', JSON.stringify(data))
    });
    // Checks if max number of players (2) has been reached
    /*socket.on('newConnection', function(data){
      //let dataObj = JSON.parse(data)
        //if (dataObj.x >= 0 && dataObj.y >= 0) {
          //Here a client is providing a new location for the moving box
          //capture location of moving box from client
          console.log("REACHED" + numPlayer.number)
          numPlayer.number += 1
      socket.emit('newConnection', numPlayer.number) //broadcast to everyone including sender
    })*/
  })

  console.log("Server Running at PORT 3000  CNTL-C to quit")
  console.log("To Test")
  console.log("http://localhost:3000/assignment3.html")
