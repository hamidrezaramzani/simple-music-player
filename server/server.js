const jsmediatags = require("jsmediatags");
const express = require("express");
const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(express.json());
app.post("/", function(req, res) {
  let source = req.body.info;
  let finishSources = [];
  for (let i = 0; i < source.length; i++) {
    jsmediatags.read(source[i], {
      onSuccess: function(tag) {
        tag = tag.tags;
        finishSources.push({
          id: i + 1,
          path: source[i],
          title: tag.title,
          artist: tag.artist,
          year: tag.year,
          picture: tag.picture
        });
        if (source.length == i + 1) {
          res.send(finishSources);
        }
      },
      onError: function(error) {
        console.log(":(", error.type, error.info);
      }
    });
  }
});

app.listen(3200, () => {
  console.log("server is runing");
});
