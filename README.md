# CurlingGame
An application built for the Web Application course

<h3>Partners</h3>
<ul>
  <li>James Ying</li>
</ul>

<h2>Program Information</h2>
<p>Node.js Version: 8.11.4</p>
<p>OS: Mac OS High Sierra 10.13.6</p>
<p>Installation required: npm install</p>

<h2>Purpose</h2>
<p>Client-side script to display componenents on HTML and working with sockets to allow multiple connections on the server </p>

<h2>Testing</h2>
<ul>
  <li>Launch the application through your terminal by going to the directory where the files are located</li>
  <li>Use Chrome browser and visit: http://localhost:3000/assignment3.html</li>
  <li>Start playing!</li>
</ul>

<h2>Instructions</h2>
<ol>
  <li>If you wish to play as a user, simply click on Player 1 or Player 2 button. To play the simulation, Player 1 can drag any of the yellow stones but not the red ones. Player 2 can drag any of the red stones, but not the yellow ones.</li>
  <li>Once Player 1 or Player 2 have been selected, no other users can select that Player. A single user cannot be both Player 1 and 2 simultaneously.</li>
  <li>The goal of the simulation is to land your stones on the target and to knock off the opponent's stones.</li>
</ol>

<h2>Issues</h2>
<ul>
  <li>If there is a collision between two rocks, followed by a secondary collision. The secondary collision does not register.</li>
  <li>Depending on the browser, buttons may not look disabled after being clicked. However, the program is fully functional. Most browsers should show the button "greyed out" after being clicked.</li>
