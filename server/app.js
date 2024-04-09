import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const port = 3000;

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello World");
});

// io.use((socket,next)=>{

// })

io.on("connection", (socket) => {
  console.log("user connected", socket.id);

  socket.on("message", ({ room, message }) => {
    console.log({ room, message });
    socket.to(room).emit("recieve-message", message);
  });

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`${socket.id}User joined ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
  //   socket.emit("welcome",`Welcome to the server`)
  //   socket.broadcast.emit("welcome", `${socket.id}, Joined the server`);
});

server.listen(port, () => {
  console.log(`Server is running of port:${port}`);
});
