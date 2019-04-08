var http = require("http");
var fs = require("fs");
const { spawnSync } = require("child_process");
var createHandler = require("node-github-webhook");

secret = fs.readFileSync("SECRET", "utf8");

if (secret) {
  secret = secret.trim();
} else {
  console.log("Need a file at the root called SECRET, with the secret.");
  return;
}

var handler = createHandler({ path: "/", secret: secret });

http
  .createServer(function(req, res) {
    handler(req, res, function(err) {
      res.statusCode = 404;
      res.end("no such location");
    });
  })
  .listen(7777);

handler.on("error", function(err) {
  console.error("Error:", err.message);
});

handler.on("ping", function(event) {
  console.log("ping");
});

handler.on("push", function(event) {
  console.log(
    "Received a push event for %s to %s",
    event.payload.repository.name,
    event.payload.ref
  );
  switch (event.path) {
    case "/":
      ls = spawnSync("./blogupdate.sh");

      console.log(`stderr: ${ls.stderr.toString()}`);
      console.log(`stdout: ${ls.stdout.toString()}`);
      break;
    default:
      console.log("Unexpected event path: " + event.path);
      break;
  }
});
