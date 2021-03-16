const { Socket } = require('socket.io');

module.exports = (ctx) => {
  // import socket io
  var restaurants = [];
  var users = [];
  var io = require('socket.io')(strapi.server, {
    cors: {
      enabled: true,
      credentials: true,
      origin: '*' //['http://10.0.0.116:8080', 'http://localhost:8080', 'http://127.0.0.1:8080', 'http://localhost:1337', 'http://127.0.0.1:1337', 'http://www.api.rangosemfila.com.br', 'https://www.api.rangosemfila.com.br', 'http://api.rangosemfila.com.br', 'https://api.rangosemfila.com.br'] // Change to My Dashboard domain later
    }
  });

  //strapi.app.proxy = true;

  // listen for user connection
  io.on('connection', function(socket){

    // send message on user connection
    socket.emit('hello', JSON.stringify({message: 'Socket is up'}));

    // Save user's socket id and restaurant id on array
    socket.on('restID', async function(res) {
      jsonReponse = await JSON.parse(res);

      var socketJsonClient = {
        "socketId": socket.id,
        "restId": jsonReponse.message
      };
      restaurants.push(socketJsonClient);

      if(socketJsonClient.socketId){
        // Set restaurant id on socket
        socket.restId = socketJsonClient.restId; 
      }
    });

    socket.on('userID', async function(res) {
      jsonReponse = await JSON.parse(res);

      var socketJsonClient = {
        "socketId": socket.id,
        "userId": jsonReponse.message
      };
      users.push(socketJsonClient);

      if(socketJsonClient.socketId){
        // Set user id on socket
        socket.userId = socketJsonClient.userId; 
      }
    });

    // listen for user disconnect
    socket.on('disconnect', () => {
      restaurants.forEach((restaurant, i) => {
        // delete saved user when they disconnect
        if(restaurant.restId === socket.restId) { 
           restaurants.splice(i, 1);
        }
      });

      users.forEach((user, i) => {
        // delete saved user when they disconnect
        if(user.userId === socket.userId) { 
           users.splice(i, 1);
        }
      });
    });
  });
  strapi.io = io; // register socket io inside strapi main object to use it globally anywhere
  strapi.emitNewIncomingOrderAlert = async (restId) => {

    var result;

    if(restaurants.length > 0){
      for (index = 0; index < restaurants.length; ++index) {
        entry = restaurants[index];
        if (entry && entry.restId == restId) {
            result = entry
        }
      }
  
      if(result !== undefined) await io.sockets.to(result.socketId).emit('food_ready', JSON.stringify({message: 'New income order'}));
    }
  };
  strapi.emitChangedOrderStatusAlert = async (userId) => {

    var result;

    if(users.length > 0){
      for (index = 0; index < users.length; ++index) {
        entry = users[index];
        if (entry && entry.userId == userId) {
            result = entry
        }
      }
  
      if(result !== undefined) await io.sockets.to(result.socketId).emit('order_status', JSON.stringify({message: 'Your order status has changed'}));
    }
  };
};
