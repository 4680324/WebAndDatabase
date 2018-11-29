# plan
## ui elements

* resign button:
  this will send a request to thes server to stop the game
* quit from the website:
  this has the same effect as the resign button
* offer draw button:
  send a draw request to the server
* game field divs:
  when the field is available and allowed and the player is the one to move, send a request to the server
* press chat send button:
  send message to server
* receive message from server:
  add message to chat field
* receive move from server:
  display in a div
* receive draw from server:
  offer draw to player and send response to server
* reveive resign from server:
  show reseign to player
  return to the splash screen

## objects

* game_board:
  this contains functions to check availability and update functions
* chat:
* interface:
  for resign and offer draw

### design patern used

* constructor pattern
* module pattern