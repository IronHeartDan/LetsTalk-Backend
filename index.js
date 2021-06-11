import express from "express";
import Cors from "cors";
import mongoose from "mongoose";
import userSchema from "./userSchema.js";
import http from "http";
import * as socketIo from "socket.io";
const app = express();
const server = http.Server(app);
const PORT = process.env.PORT || 5000;

// Firebase Messenging
import admin from "./firebase.js";
import { constants } from "buffer";

const dbConnectionUrl =
  "mongodb+srv://devdan:hjLkOIF30LsNTQ1p@letstalkcluster.lj0a1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
//DB Config
mongoose
  .connect(dbConnectionUrl, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => console.log(error));

app.use(express.json());
app.use(Cors());
app.use(express.static("./public"));

app.get("/", (req, res) => {
  res.sendFile("public/index.html");
});

app.get("/api/users/deleteAll", (req, res) => {
  userSchema.deleteMany((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.get("/api/users", (req, res) => {
  userSchema.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.post("/api/create", (req, res) => {
  const user = req.body;
  if (!user) {
    res.sendStatus(403).send("Body Is Empty...!!!");
    return;
  }
  userSchema.create(user, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.post("/api/update", (req, res) => {
  const user = req.body;
  if (!user) {
    res.sendStatus(403).send("Body Is Empty...!!!");
    return;
  }
  userSchema.updateOne({ number: user.number }, user, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.get("/api/user/exists/:number", (req, res) => {
  const number = req.params.number;
  userSchema.exists({ number: number }, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.post("/api/syncContacts", (req, res) => {
  let contacts = req.body;
  let contactsExists = [];

  if (contacts.length > 0) {
    contacts.forEach(async (item, index, object) => {
      userSchema.find({ number: item.number }, (err, data) => {
        if (err) {
          res.status(500).send(err);
        } else {
          if (data.length > 0) {
            item.profile_pic = data[0].profile_pic;
            contactsExists.push(item);
          }
          if (index == contacts.length - 1) {
            res.status(200).send(contactsExists);
          }
        }
      });
    });
  } else {
    res.status(200).send([]);
  }
});

app.delete("/api/delete/:number", (req, res) => {
  const number = req.params.number;
  if (!number) {
    res.sendStatus(403).send("Number Is Required...!!!");
    return;
  }
  userSchema.deleteOne({ number: number }, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

const io = new socketIo.Server(server, {
  cors: {
    origin: "localhost:3000",
    methods: ["GET", "POST"],
  },
});

const users = new Map();

io.on("connection", function (socket) {
  console.log(socket.id + " : Connected...");

  // Store User
  let who = socket.handshake.query.number;
  let showOnline = JSON.parse(socket.handshake.query.online);
  users.set(who, { socketId: socket.id, isOnline: showOnline });
  socket.join(who);
  // if(showOnline === true){
  // socket.to(who).emit('isOnline',true)
  // }

  socket.on("setOnline", (data) => {
    let w = JSON.parse(data);
    if (users.has(w.number)) {
      users.set(w.number, { socketId: socket.id, isOnline: w.status });
      socket.to(w.number).emit("isOnline", w.status);
    }
  });

  //Chat System
  socket.on("enterRoom", (data) => {
    socket.join(data);
  });

  socket.on("exitRoom", (data) => {
    socket.leave(data);
  });

  socket.on("isOnline", (data) => {
    //If Exists
    if (users.has(data)) {
      // If Online
      if (users.get(data).isOnline) {
        socket.emit("isOnline", true);
      } else {
        socket.emit("isOnline", false);
      }
    } else {
      socket.emit("isOnline", false);
    }
  });

  socket.on("typing", (data) => {
    data = JSON.parse(data);
    if (users.has(data.to)) {
      io.to(users.get(data.to).socketId).emit("typing", data);
    }
  });

  socket.on("message", (data) => {
    //Parse JSON
    let msg = JSON.parse(data);
    //If Exists
    if (users.has(msg.to)) {
      // If Online
      if (users.get(msg.to).isOnline) {
        //If In Chat
        if (
          io.sockets.adapter.rooms.get(msg.from).has(users.get(msg.to).socketId)
        ) {
          io.to(users.get(msg.to).socketId).emit("message", msg);
          msg.msgStats = 1;
          socket.emit("msgStats", msg);
        } else {
          // io.to(users.get(msg.to).socketId).emit("message",msg)
          msg.msgStats = 1;
          socket.emit("msgStats", msg);
          sendPush(msg);
        }
      } else {
        msg.msgStats = 1;
        socket.emit("msgStats", msg);
        sendPush(msg);
      }
      //Does Not Exists
    } else {
      msg.msgStats = 1;
      socket.emit("msgStats", msg);
      sendPush(msg);
    }
  });

  socket.on("msgStats", (data) => {
    let msg = JSON.parse(data);
    if (users.has(msg.from)) {
      // If Online
      if (users.get(msg.from).isOnline) {
        io.to(users.get(msg.from).socketId).emit("msgStats", msg);
      } else {
        // sendPushSent(msg);
      }
    } else {
      // sendPushSent(msg);
    }
  });

  socket.on("markSeen", (data) => {
    data = JSON.parse(data);
    if (users.has(data.to)) {
      // If Online
      if (users.get(data.to).isOnline) {
        io.to(users.get(data.to).socketId).emit("markSeen", data);
      } else {
        // sendPushSeen(data);
      }
    } else {
      // sendPushSeen(data);
    }
  });

  socket.on("rtcCall", (data) => {
    data = JSON.parse(data);
    if (users.has(data.to)) {
      // If Online
      if (users.get(data.to).isOnline) {
        //If In Chat
        if (
          io.sockets.adapter.rooms
            .get(data.from)
            .has(users.get(data.to).socketId)
        ) {
          io.to(users.get(data.to).socketId).emit("rtcCall", data);
        } else {
          socket.emit("rtcOffline");
        }
      } else {
        socket.emit("rtcOffline");
      }
    } else {
      socket.emit("rtcOffline");
    }
  });

  socket.on("callRejected", (data) => {
    console.log(data + "Decline");
    io.to(users.get(data).socketId).emit("callRejected");
  });

  socket.on("rtcAnswer", (data) => {
    data = JSON.parse(data);
    console.log(data);
    if (users.has(data.to)) {
      io.to(users.get(data.to).socketId).emit("rtcAnswer", data);
    }
  });

  socket.on("disconnecting", () => {
    let who = socket.handshake.query.number;
    socket.to(who).emit("isOnline", false);
    // let rooms = Array.from(socket.rooms)
    // socket.to(rooms[1]).emit('isOnline',false)
  });

  socket.on("disconnect", () => {
    console.log(socket.id + " : Disconnected...");

    //Remove User
    let who = socket.handshake.query.number;
    users.delete(who);
  });
});

function sendPush(msg) {
  //send Push
  userSchema.findOne({ number: msg.to }, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      // console.log(`Sending Push To:: ${user.number}`);

      var payload = {
        // To User
        token: user.pushToken,

        data: {
          data_type: "1",
          msg: JSON.stringify(msg),
        },
        //Set Priority In ANDROID
        android: {
          priority: "high",
        },
      };

      // Send a message to the device corresponding to the provided
      // registration token.
      admin
        .messaging()
        .send(payload)
        .then((response) => {
          // Response is a message ID string.
          console.log("Successfully sent message:", response);
        })
        .catch((error) => {
          console.log("Error sending message:", error);
        });
    }
  });
  //End Push
}

function sendPushSent(msg) {
  //send Push
  userSchema.findOne({ number: msg.from }, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      // console.log(`Sending Push To:: ${user.number}`);

      var payload = {
        // To User
        token: user.pushToken,

        data: {
          data_type: "2",
          data_sent: JSON.stringify(msg),
        },
        //Set Priority In ANDROID
        android: {
          priority: "high",
        },
      };

      // Send a message to the device corresponding to the provided
      // registration token.
      admin
        .messaging()
        .send(payload)
        .then((response) => {
          // Response is a message ID string.
          console.log("Successfully sent message:", response);
        })
        .catch((error) => {
          console.log("Error sending message:", error);
        });
    }
  });
  //End Push
}

function sendPushSeen(data) {
  //send Push
  userSchema.findOne({ number: data.to }, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      // console.log(`Sending Push To:: ${user.number}`);

      var payload = {
        // To User
        token: user.pushToken,

        data: {
          data_type: "3",
          data_seen: JSON.stringify({ from: data.from, to: data.to }),
        },
        //Set Priority In ANDROID
        android: {
          priority: "high",
        },
      };

      // Send a message to the device corresponding to the provided
      // registration token.
      admin
        .messaging()
        .send(payload)
        .then((response) => {
          // Response is a message ID string.
          console.log("Successfully sent message:", response);
        })
        .catch((error) => {
          console.log("Error sending message:", error);
        });
    }
  });
  //End Push
}

server.listen(PORT, () => {
  console.log(`Listening On ${PORT}`);
});
