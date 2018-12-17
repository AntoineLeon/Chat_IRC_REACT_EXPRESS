const express = require("express");
const app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

io.on("connection", socket => {
  console.log("New client connected");
  socket.on("new-message", function(msg) {
    console.log(msg);
    io.emit("receive-message", msg);
  });
});

http.listen(3000, function() {
  console.log("listening on *:3000");
});
