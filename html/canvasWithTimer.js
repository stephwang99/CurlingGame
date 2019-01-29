///////////////////////////////////////////////////////////////////////////////
//
//    COMP2406 Assignment 3       Date: November 8, 2018
//    Program Author: Stephanie Wang and James Ying
//    Purpose: Client-side scipt to display curling simulation
//    Compilation command: node server.js
//    View webpage in Chrome: http://localhost:3000/assignment3.html
//
///////////////////////////////////////////////////////////////////////////////
let timer //timer for animation of moving string etc.
let deltaX, deltaY //location where mouse is pressed relative to word origin
let canvas = document.getElementById('canvas1') //our drawing canvas
let topMargin = 40 //hard coded top margin white space of page
let leftMargin = 40 //hard code left margin white space of page
// circles keeps track of 6 throwable stones
// bigCircles keeps track of the magnified version of these stones
let circles = [], bigCircles = [];
let distX, distY
let locations = []
// circleBeingMoved is the stone being thrown by the user
let circleBeingMoved
let frictionX = 1.05
let frictionY = 1.05
// isPlayer and numPlayers keeps track if of user and player status
let isPlayer = 0
let players = {
  player1: 0,
  player2: 0
}

let numPlayers = {
  number: 0
}

// Initialize 6 small stones at the beginning of the game
circles.push({x: canvas.width-200 + 0 * 30, y: canvas.height - 10, radius: (canvas.height/2-290), incrX: 0, incrY: 0, directionX: 1, directionY: 1})
circles.push({x: canvas.width-200 + 1 * 30, y: canvas.height - 10, radius: (canvas.height/2-290), incrX: 0, incrY: 0, directionX: 1, directionY: 1})
circles.push({x: canvas.width-200 + 2 * 30, y: canvas.height - 10, radius: (canvas.height/2-290), incrX: 0, incrY: 0, directionX: 1, directionY: 1})
circles.push({x: canvas.width-200 + 3 * 30, y: canvas.height - 10, radius: (canvas.height/2-290), incrX: 0, incrY: 0, directionX: 1, directionY: 1})
circles.push({x: canvas.width-200 + 4 * 30, y: canvas.height - 10, radius: (canvas.height/2-290), incrX: 0, incrY: 0, directionX: 1, directionY: 1})
circles.push({x: canvas.width-200 + 5 * 30, y: canvas.height - 10, radius: (canvas.height/2-290), incrX: 0, incrY: 0, directionX: 1, directionY: 1})

// Function: getCircleAtLocation
// Purpose: to retrieve a selected stone's location on the canvas
// Parameters: aCanvasX, aCanvasY
function getCircleAtLocation(aCanvasX, aCanvasY) {
  let context = canvas.getContext('2d')
  for (let i = 0; i < circles.length; i++) {
    console.log("X: " + circles[i].x + " X2: " + (circles[i].x+circles[i].radius))
    if ((aCanvasX > (circles[i].x-circles[i].radius) && aCanvasX < circles[i].x+circles[i].radius) &&
      (aCanvasY > circles[i].y-circles[i].radius && aCanvasY < circles[i].y+circles[i].radius)) {
      return circles[i]
    }
  }
  return null
}

// Function: drawCanvas()
// Purpose: Display the Canvas. Stones are displayed and magnified on the curling canvas
// Parameters: none
function drawCanvas() {
  // Let user know if they are player or viewer
  if(isPlayer == 1){
    document.getElementById("text-area").innerHTML = 'You are currently Player1'
  }else if(isPlayer ==2){
    document.getElementById("text-area").innerHTML = 'You are currently Player2'
  }else{
    document.getElementById("text-area").innerHTML = 'You are currently a Viewer'
  }


  let context = canvas.getContext('2d')
  context.fillStyle = 'white'
  context.fillRect(0, 0, canvas.width, canvas.height) //erase canvas

  // Draw Targets on Canvas
  context.fillStyle = 'blue'
  context.beginPath();
  context.arc(canvas.width / 3, //x co-ord
    canvas.height / 2, //y co-ord
    canvas.height / 2 - 100, //radius
    0, //start angle
    2 * Math.PI //end angle
  );
  context.fill()

  context.fillStyle = 'white'
  context.beginPath();
  context.arc(canvas.width / 3, //x co-ord
    canvas.height / 2, //y co-ord
    canvas.height / 2 - 150, //radius
    0, //start angle
    2 * Math.PI //end angle
  );
  context.fill()

  context.fillStyle = 'red'
  context.beginPath();
  context.arc(canvas.width / 3, //x co-ord
    canvas.height / 2, //y co-ord
    canvas.height / 2 - 200, //radius
    0, //start angle
    2 * Math.PI //end angle
  );
  context.fill()

  context.fillStyle = 'white'
  context.beginPath();
  context.arc(canvas.width / 3, //x co-ord
    canvas.height / 2, //y co-ord
    canvas.height / 2 - 250, //radius
    0, //start angle
    2 * Math.PI //end angle
  );
  context.fill()

  context.strokeStyle = 'black'
  context.beginPath();
  context.rect(canvas.width/1.5, 0, 1, canvas.height);
  context.stroke()

  context.fillStyle = 'blue'
  context.beginPath();
  context.arc(canvas.width / 1.2, //x co-ord
    canvas.height / 4, //y co-ord
    canvas.height / 2 - 200, //radius
    0, //start angle
    2 * Math.PI //end angle
  );
  context.fill()

  context.fillStyle = 'white'
  context.beginPath();
  context.arc(canvas.width / 1.2, //x co-ord
    canvas.height / 4, //y co-ord
    canvas.height / 2 - 225, //radius
    0, //start angle
    2 * Math.PI //end angle
  );
  context.fill()

  context.fillStyle = 'red'
  context.beginPath();
  context.arc(canvas.width / 1.2, //x co-ord
    canvas.height / 4, //y co-ord
    canvas.height / 2 - 250, //radius
    0, //start angle
    2 * Math.PI //end angle
  );
  context.fill()

  context.fillStyle = 'white'
  context.beginPath();
  context.arc(canvas.width / 1.2, //x co-ord
    canvas.height / 4, //y co-ord
    canvas.height / 2 - 275, //radius
    0, //start angle
    2 * Math.PI //end angle
  );
  context.fill()
  // Draw 6 Rocks at Bottom of Canvas
  for(var i = 0; i < circles.length; i ++){
    context.fillStyle = 'gray'
    context.beginPath();
    context.arc(circles[i].x, //x co-ord
      circles[i].y, //y co-ord
      circles[i].radius, //radius
      0, //start angle
      2 * Math.PI //end angle
    );
    context.fill()

    context.beginPath();
    context.arc((circles[i].x - 533.33) *2, //x co-ord
      circles[i].y*2, //y co-ord
      circles[i].radius*2, //radius
      0, //start angle
      2 * Math.PI //end angle
    );
    context.fill()

    context.fillStyle = 'yellow'
    if(i > 2){
      context.fillStyle = 'red'
    }
      context.beginPath();
      context.arc(circles[i].x, //x co-ord
      circles[i].y, //y co-ord
      circles[i].radius/2, //radius
      0, //start angle
      2 * Math.PI //end angle
    );
    context.fill()

    context.beginPath();
      context.arc((circles[i].x -533.33)*2, //x co-ord
      circles[i].y*2, //y co-ord
      circles[i].radius/2*2, //radius
      0, //start angle
      2 * Math.PI //end angle
    );
    context.fill()
  }

}

function getCanvasMouseLocation(e) {
  //provide the mouse location relative to the upper left corner of the canvas
  let rect = canvas.getBoundingClientRect()

  //account for amount the document scroll bars might be scrolled
  let scrollOffsetX = $(document).scrollLeft()
  let scrollOffsetY = $(document).scrollTop()

  let canX = e.pageX - rect.left - scrollOffsetX
  let canY = e.pageY - rect.top - scrollOffsetY

  return {
    canvasX: canX,
    canvasY: canY
  }
}

// Function: handleMouseDown()
// Purpose: Initialize rock throw when user clicks on selected rock
// Parameters: event e
function handleMouseDown(e) {
  if(isPlayer > 0){
    let canvasMouseLoc = getCanvasMouseLocation(e)
    let canvasX = canvasMouseLoc.canvasX
    let canvasY = canvasMouseLoc.canvasY
    origX = canvasX;
    origY = canvasY;
    console.log("Mouse Down:" + canvasX + ", " + canvasY)

    circleBeingMoved = getCircleAtLocation(canvasX, canvasY)
    let selectedRock
    if(circleBeingMoved != null){
      for(let i = 0; i < circles.length; i++){
        if(circleBeingMoved.x == circles[i].x && circleBeingMoved.y == circles[i].y){
          selectedRock = i
          break
        }
      }
    }
    if(isPlayer ==1){
      if(selectedRock < 3){
        console.log("CIRCLE: " + circleBeingMoved)
        if (circleBeingMoved != null) {
          deltaX = circleBeingMoved.x - canvasX
          deltaY = circleBeingMoved.y - canvasY
          $("#canvas1").mousemove(handleMouseMove)
          $("#canvas1").mouseup(handleMouseUp)
        }
      }
    }
    else if(isPlayer==2){
      if(selectedRock > 2){
        console.log("CIRCLE: " + circleBeingMoved)
        if (circleBeingMoved != null) {
          deltaX = circleBeingMoved.x - canvasX
          deltaY = circleBeingMoved.y - canvasY
          $("#canvas1").mousemove(handleMouseMove)
          $("#canvas1").mouseup(handleMouseUp)
        }
      }
    }

    // Stop propagation of the event and stop any default browser action
    e.stopPropagation()
    e.preventDefault()
    drawCanvas()
  }
}

// Function: handleMouseMove()
// Purpose: Update position of rock being thrown as user drags mouse
// Parameters: event e
function handleMouseMove(e) {
  //console.log("mouse move");

  let canvasMouseLoc = getCanvasMouseLocation(e)
  let canvasX = canvasMouseLoc.canvasX
  let canvasY = canvasMouseLoc.canvasY

  locations.push({x: canvasX, y: canvasY})

//  console.log("move: " + canvasX + "," + canvasY)

  circleBeingMoved.x = canvasX + deltaX
  circleBeingMoved.y = canvasY + deltaY

  e.stopPropagation()
  drawCanvas()
}

// Function: handleMouseUp()
// Purpose: Releases the rock while checking for boundaries of the walls
// Parameters: event e
function handleMouseUp(e) {
    e.stopPropagation()
    circleBeingMoved.directionX = 1
    circleBeingMoved.directionY = 1
    // Get Mouse Location
    let canvasMouseLoc = getCanvasMouseLocation(e)
    let mouseX = canvasMouseLoc.canvasX
    let mouseY = canvasMouseLoc.canvasY
    //console.log("Mouse Up: " + mouseX + ", " + mouseY)

    distX = (mouseX-locations[locations.length-3].x)*120
    distY = (mouseY-locations[locations.length-4].y)*120
    if(mouseX < locations[locations.length-3].x){
      distX = (mouseX-locations[locations.length-3].x)*120
      circleBeingMoved.incrX = (mouseX - (mouseX+distX))/400
      circleBeingMoved.incrY = (mouseY - (mouseY+distY))/400
    }
    else{
      distX = (mouseX-locations[locations.length-5].x)*120
      distY = (mouseY-locations[locations.length-5].y)*120
      circleBeingMoved.incrX = (-distX)/400
      circleBeingMoved.incrY = (-distY)/400

    }
    if(circleBeingMoved.incrX < 1){
      circleBeingMoved.directionX = circleBeingMoved.directionX *-1
      circleBeingMoved.incrX *= -1
    }

    // Start timer
    timer = setInterval(handleTimer, 100)

    $("#canvas1").off("mousemove", handleMouseMove) //remove mouse move handler
    $("#canvas1").off("mouseup", handleMouseUp) //remove mouse up handler
    //remove mouse move and mouse up handlers but leave mouse down handler
  drawCanvas() //redraw the canvas
}

// Function: checkForCollision()
// Purpose: Check for collision between two rocks
// Parameters: none
function checkForCollision() {
  if(circleBeingMoved != null) {
    let tempX = circleBeingMoved.x - (circleBeingMoved.incrX * circleBeingMoved.directionX);
    let tempY = circleBeingMoved.y - (circleBeingMoved.incrY * circleBeingMoved.directionY);

    for(let i = 0; i < circles.length; i++) {
        console.log("moving  X: " + tempX + "Y: " + tempY)
        console.log("circles X: " + circles[i].x + "Y: " + circles[i].y);
        // If there is a collision
        if((tempX >= circles[i].x-(circles[i].radius+5) && tempX <= circles[i].x+circles[i].radius+5) && (tempY >= circles[i].y-(circles[i].radius+5) && tempY <= circles[i].y+circles[i].radius+5)){
            console.log("Collision!");
            circleBeingMoved.directionX  *= -1
            circleBeingMoved.directionY *= -1
            // Make sure second rock is going in the right direction
            if(circleBeingMoved.x > circles[i].x)
              circles[i].directionX = -1
            else
              circles[i].directionX = 1
            if(circleBeingMoved.y < circles[i].y)
                circles[i].directionY = -1
            else
                circles[i].directionY = 1
            // Multiply all Increments by a factor of 0.5
            circles[i].incrX = 0.5*circleBeingMoved.incrX
            circles[i].incrY = 0.5*circleBeingMoved.incrY
            circleBeingMoved.incrY *= 0.5
            circleBeingMoved.incrX *= 0.5
            break;
        }
    }
  }
}

// Function: handleTimer()
// Purpose: Updates the trajectory of each rock as it moves or collides
// Parameters: none
function handleTimer() {
  // Check for Collision
  checkForCollision()

  // Update positions for other rocks
  for(let i = 0; i < circles.length; i++){
    // Handle Y-position change
    if(circles[i].y - (circles[i].incrY * circles[i].directionY) <= 0 || circles[i].y - (circles[i].incrY * circles[i].directionY) >= canvas.height){
      circles[i].directionY = circles[i].directionY * -1
    }
    else{
      circles[i].y = circles[i].y - (circles[i].incrY * circles[i].directionY);
      circles[i].incrY = circles[i].incrY/frictionY;
    }
    // Handle X-position change
    if(circles[i].x - (circles[i].incrX * circles[i].directionX) <= (canvas.width/1.5) || circles[i].x - (circles[i].incrX * circles[i].directionX) + circles[i].radius > canvas.width){
      circles[i].directionX = circles[i].directionX * -1
    }
    else{
      circles[i].x = circles[i].x - (circles[i].incrX * circles[i].directionX);
      circles[i].incrX = circles[i].incrX/frictionX;
    }
//    console.log("\n incrX: " + circles[i].incrX + ", incrY: " + circles[i].incrY )
  }
  // If rock is hardly moving (< 0.5), set increment X and Y to 0
  for(let i = 0; i < circles.length; i++){
    if(circles[i].incrX < 0.5){
        circles[i].incrX = 0;
    }
    if(circles[i].incrY < 0.5){
      circles[i].incrY = 0;
    }
  }
  // If all rocks are at a stop, stop the timer
  let flag = true
  for(let i = 0; i < circles.length; i ++){
    // Clear Timeout if Increment Rocks have stopped moving
    if(circles[i].incrX != 0 && circles[i].incrY != 0){
      flag = false;
      break;
    }
  }
  if(flag){
    clearTimeout(timer)
  }

  if(circleBeingMoved != null) {
    // Update socket
    let dataObj = {
      data:circles,
      x: circleBeingMoved.x,
      y: circleBeingMoved.y,
    }
    let jsonString = JSON.stringify(dataObj)
    socket.emit('circleData', jsonString)
  }
  drawCanvas()
}

// Retrieve information of rock placement to allow server to emit to all clients
let socket = io('http://' + window.document.location.host)
socket.on('circleData', function(data) {
  console.log("data: " + data)
  console.log("typeof: " + typeof data)
  let locationData = JSON.parse(data)
  // Update all circle locations
  for(let i=0; i<circles.length; i++) {
    circles[i].x = locationData.data[i].x
    circles[i].y = locationData.data[i].y
  }
  drawCanvas()
})
// Handles when player 1 button gets clicked, it emits to all that player 1 is taken
function handlePlayer1(){
  if(players.player1 != 0) return
  else{
    players.player1 = 1
    socket.emit('handle_player', JSON.stringify(players))
    if(isPlayer == 2){
      players.player2 = 0
      let dataObj = {
        player: isPlayer
      }
      socket.emit('player_free', JSON.stringify(dataObj))
    }
  }
  isPlayer = 1
  drawCanvas()
}
// Same as handlePlayer1() except it handles for Player 2
function handlePlayer2(){
  console.log("ISPLAYER " + isPlayer)
  if(players.player2 != 0) return
  else{
    players.player2 = 1
    socket.emit('handle_player', JSON.stringify(players))

    if(isPlayer == 1){
      players.player1 = 0
      let dataObj = {
        player: isPlayer
      }
      socket.emit('player_free', JSON.stringify(dataObj))
    }
  }
  //players.player2 = 1
  isPlayer = 2
  //socket.emit('handle_player', JSON.stringify(players))
  drawCanvas()
}
// When a player decides to stop playing, it notifies the server
function stopGame(){

  if(isPlayer > 0){
    let dataObj = {
      player: isPlayer
    }
    socket.emit('player_free', JSON.stringify(dataObj))
  }
  //drawCanvas()
}

// Receives information from server when player join and updates the buttons
socket.on('handle_player', (data)=>{
  let users = JSON.parse(data)
  if(users.player1 == 1){
    players.player1 = 1
    document.getElementById("Player1").setAttribute("disabled", "disabled")
  }
  if(users.player2 == 1){
    players.player2 = 1
    document.getElementById("Player2").setAttribute("disabled", "disabled")
  }
  //drawCanvas();
})

// Receives information from server when player leaves and updates the buttons
socket.on('player_free', (data)=>{
  let users = JSON.parse(data)
  console.log("DATA " + data)
  if (users.player1 == 0){
    players.player1 = 0
    if(isPlayer == 1){
      isPlayer = 0
    }
    document.getElementById("Player1").removeAttribute("disabled")
  }
  if(users.player2 == 0){
    players.player2 = 0
    if(isPlayer == 2){
      console.log("REACH?")
      isPlayer = 0
    }
    document.getElementById("Player2").removeAttribute("disabled")
  }
  drawCanvas()
})

$(document).ready(function() {
  socket.emit('handle_player', JSON.stringify(players))
  console.log("h")
  $("#canvas1").mousedown(handleMouseDown)
  $("#canvas1").mouseup(handleMouseUp)
  drawCanvas()
})
