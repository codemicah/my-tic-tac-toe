const express = require("express"),
              http = require("http"),
              socket = require("socket.io"),
              ejs = require("ejs");

const e = require("express");
const { disconnect } = require("process");

const app = express();
const server = http.createServer(app);
const io = socket(server);

app.use(express.static("public"))
const games = []
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname })
});

app.get("/game/:gameId", (req, res) => {
  console.log("User joined game")
  console.log(games);
  var gameUrl = "/" + req.params.gameId
  console.log(gameUrl)
  if (games.length > 0) {
    games.forEach((game) => {
      if (game.url == gameUrl) {
        return res.render("game.ejs", {
          game,
        });
      }
      else {
        res.redirect("back");
      }
    });
  } else {
    res.redirect("back");
  }
});


io.on("connection", (socket) => {
  console.log("User joined");
  const gameData = {
    open: true,
    players: {
      player1: "",
      player2: "",
    },
    gameId: "",
    url: "",
  };
  const openGames = [];
  if (games.length > 0) {
    games.forEach((game) => {
      if (game.open == true) {
        openGames.push(game);
      }
    });
    io.emit("games", openGames);
  }

  socket.on("data", (data) => {
    if (data.type == "create") {
      gameData.gameId = socket.id;
      gameData.players.player1 = data.username;
      gameData.url = "/" + socket.id;
      games.push(gameData);

      //emit details
      io.emit("link", socket.id);
    } else {
      openGames.forEach((game) => {
        if (game.url == data.url) {
          game.open = false;
          game.players.player2 = data.username;
        }
      });
    }
  });
  socket.on("disconnect", (socket) => {
    console.log("Disconnected");
  });
});

server.listen(4000, () => {
  console.log("server is running on 4000")
});