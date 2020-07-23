const express = require("express"),
            http = require("http");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);

app.use(express.static(__dirname))
app.get("/", (req, res)=>{
    res.sendFile("index.html", { root: __dirname })
});

app.get("/game/:gameId", (req, res)=>{
    res.sendFile("game.html", { root: __dirname })
})

var games = []
io.on("connection", (socket)=>{
    var gameData = {
      open: true,
      players: {
        player1: "",
        player2: "",
      },
      gameId: "",
      url: "",
    };

    if(games.length > 0){
        io.emit("games", games)
    }
    socket.on("data", (data)=>{
        console.log(data)
        if(data.type == "create"){
            gameData.gameId = socket.id;
            gameData.players.player1 = data.username;
            gameData.url = "/" + socket.id;
            games.push(gameData);
        }else{
            console.log("joining")
        }
        console.log("User joined " + socket.id +" " +  data.username);
        console.log("username: " + data.username);
        io.emit("username", data.username, " from ", socket.id);
    });
    socket.on("disconnect", () => {
    //   console.log("User left");
    });
});

server.listen(3000, ()=>{
    console.log("server running on port 3000")
})