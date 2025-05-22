const { Server } = require("socket.io");
const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer();

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});


const DATA_FILE = path.join(__dirname, "teams.json");

function saveTeamData(data) {
  let existing = [];

  try {
    if (fs.existsSync(DATA_FILE)) {
      const fileContent = fs.readFileSync(DATA_FILE, "utf8").trim();

      if (fileContent) {
        existing =[]
      }
    }
  } catch (err) {
    console.error("Error reading existing data:", err);
    // Optional: Clear corrupted file
    existing = [];
  }

  existing.push(data);

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(existing, null, 2));
    console.log("Team data saved.");
  } catch (err) {
    console.error("Error saving data:", err);
  }
}


// Utility: Read saved team data
function getSavedTeamData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const fileContent = fs.readFileSync(DATA_FILE);
      return JSON.parse(fileContent);
    }
  } catch (err) {
    console.error("Error reading saved team data:", err);
  }
  return [];
}

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("message", (msg) => {
    console.log("Message from client:", msg);
    socket.broadcast.emit("message", msg);
  });

  socket.on("teamdata", (msg, callback) => {
    console.log("teamdata from client:", msg);

    // Save to file
    saveTeamData(msg);

    // Emit to others
    socket.broadcast.emit("teamdata", msg);

    // Acknowledge to sender
    if (callback) callback({ status: "received" });
  });

  socket.on("savedteamdata", (callback) => {
    const savedData = getSavedTeamData();
    console.log("Sending saved team data to client");

    if (callback) callback({ status: "ok", data: savedData });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(5000, '0.0.0.0', () => {
  console.log("Socket.IO server running at http://0.0.0.0:5000");
});
