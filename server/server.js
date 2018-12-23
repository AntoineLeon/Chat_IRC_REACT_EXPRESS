const express = require("express");
const app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

var rooms = [
  {
    owner: "admin",
    name: "generale"
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

function searchuserid(user) {
  var nb = 0;
  for (var i in users) {
    nb++;
    if (user == users[i].name) {
      return nb;
    }
  }
  return null;
}

function searchroomid(room) {
  var nb = 0;
  for (var i in rooms) {
    nb++;
    if (room == rooms[i].name) {
      return nb;
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
  console.log("New client connected");
  var i = 1;
  socket.user = {
    name: "unknow",
    room: rooms[0].name,
    id: ""
  };

  socket.on("user", username => {
    socket.user.name = username;
    users.push({
      name: username,
      room: rooms[0].name
    });
  });

  socket.join(socket.user.room);

  socket.on("new-message", msg => {
    var test = msg.split(" ");
    if (test[0] === "BOT-ALL") {
      io.emit("receive-message", msg);
    } else if (test[0] === "BOT-PRIVATE") {
      io.to(socket.id).emit("receive-message", msg);
    } else {
      io.to(socket.user.room).emit("receive-message", msg);
    }
  });

  socket.on("join", room => {
    if (searchroom(room)) {
      socket.leave(socket.user.room);
      socket.join(room);
      var suser = searchuser(socket.user.name);
      suser.room = room;
      socket.user.room = room;
    }
  });

  socket.on("part", room => {
    if (searchroom(room)) {
      socket.leave(socket.user.room);
      socket.join("generale");
      console.log(socket.user);
      console.log(socket.user);
      socket.user.room = "generale";
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
    }
  });
  socket.on("disconnect", () => {
    var suser = searchuser(socket.user.name);
    if (suser) {
      var nb = searchuserid(socket.user.name);
      users.splice(0, nb);
    }
  });

  socket.on("list", () => {
    var tab = [];
    for (var i in rooms) {
      tab.push(rooms[i].name);
    }
    io.to(socket.id).emit("receive-message", "List of channel : " + tab + "\n");
  });

  socket.on("users", () => {
    var tab = [];
    for (var i in users) {
      tab.push(users[i].name);
    }
    io.to(socket.id).emit("receive-message", "List of users : " + tab + "\n");
  });

  socket.on("delete", room => {
    socket.leave(socket.user.room);
    socket.join("generale");
    socket.user.room = "generale";

    var sroom = searchroom(room);
    if (sroom) {
      var nb = searchroomid(room);
      rooms.splice(nb - 1, nb);
    }
  });
});

http.listen(3000, function() {
  console.log("listening on *:3000");
});
