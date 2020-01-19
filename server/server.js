const mm = require("music-metadata");
const express = require("express");
const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(express.json());
app.post("/", (req, res) => {
  let source = req.body.info;
  let finishSources = [];
  Promise.all(source.map((path, i) => {
    return mm.parseFile(path).then(metadata => {
      tag = metadata.common;
      finishSources.push({
        id: i + 1,
        path: path,
        title: tag.title,
        artist: tag.artist,
        year: tag.year,
        picture: tag.picture ? tag.picture[0] : undefined
      });
    }, error => {
      throw new Error(`Failed to parse ${path}: ${error.message}`);
    });
  })).then(() => {
    res.send(finishSources);
  }, error => {
    res.status(500).send(error.message);
  });
});

app.listen(3200, () => {
  console.log("server is runing");
});
