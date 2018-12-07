# plan
## ui elements

* resign button:
  stop the connection to the server, show a resign(you lost) box to the resigning player.
  when connection stops, server knows he done.
  return to splashscreen after x seconds

* quit from the website:
  >resign

* offer draw button:
  send a draw request to the server
        when server recieves draw request:
            send message to other player with (y,n)
            if other players says y, show draw message, return to splash after x seconds
            if other player says n, continue game.

* game field divs:
  send a request to the server iff
    -  requested place is valid
    -  it's the players turn

* press chat send button:
  send message to server
    

* receive message from server:
  add message to chat field

* receive move from server:
  display in a div

* receive draw from server:
  offer draw to player and send response to server

* reveive resign from server:
  show resign to player
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

## message types

### server to player

* move made by other player/ new board state
* end of game/ details
* other player connected/ player details
* offer draw from other player

### player to server

* move made by player
* offer draw
* end of game/ details