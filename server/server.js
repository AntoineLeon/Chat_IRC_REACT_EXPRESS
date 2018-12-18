const express = require("express");
const app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

var rooms = [
  {
    owner: "admin",
    name: "generale"
  },
  {
    owner: "antoine",
    name: "salut"
  },
  {
    owner: "nom du mec",
    name: "ok"
  }
];

var users = [];

function searchuser(user) {
  for (var i in users) {
    if (user == users[i].name) {
      return users[i];
    }
  }
  return null;
}

searchroom = room => {
  for (var i in rooms) {
    if (room == rooms[i].name) {
      return true;
    }
  }
  return false;
};

io.on("connection", socket => {
  socket.user = {
    name: "unknow",
    room: rooms[0].name
  };

  socket.on("user", username => {
    socket.user.name = username;
    users.push({
      name: username,
      room: rooms[0].name
    });
  });

  socket.join(socket.user.room);

  console.log("New client connected");
  socket.on("new-message", msg => {
    console.log(socket.user.room);
    io.to(socket.user.room).emit("receive-message", msg);
  });

  socket.on("join", function(room) {
    if (searchroom(room)) {
      socket.leave(socket.user.room);
      socket.join(room);
      var suser = searchuser(socket.user.name);
      suser.room = room;
      socket.user.room = room;
      console.log(room);
    }
  });

  socket.on("create", room => {
    if (!searchroom(room)) {
      rooms.push({
        owner: socket.user.name,
        name: room
      });
    }
  });

  socket.on("where", username => {
    var user = searchuser(username);
    if (user) {
      console.log(user);
    }
  });
});

http.listen(3000, function() {
  console.log("listening on *:3000");
});
