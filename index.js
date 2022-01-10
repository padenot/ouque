var http = require("http");
var process = require("process");
var fs = require("fs");
const { spawnSync } = require("child_process");
var createHandler = require("node-github-webhook");

var port = parseInt(process.argv[2]) || 7777;

var config = fs.readFileSync("config.json", "utf8");

if (config) {
  config = JSON.parse(config);
} else {
  console.log("Need a file at the root called config.json, with the secrets and scripts.");
  return;
}

function generaterHandler(handlerOpts) {
  var handlers = handlerOpts.reduce(function(hs, opts) {
    const handler = createHandler(opts);
    handler.on('error', function(err) {
      console.error('Error:', err.message)
    })
    handler.on('push', function (event) {
      var url = event.url
      console.log("push on " + event.url);
      var out = spawnSync("./" + config[event.url].script);
      console.log(`stderr: ${out.stderr.toString()}`);
      console.log(`stdout: ${out.stdout.toString()}`);
    })

    handler.on("error", function(err) {
      console.error("Error:", err.message);
    });

    handler.on("ping", function(event) {
      console.log("ping");
    });
    hs[opts.path] = handler;
    return hs
  }, {})

  return http.createServer(function(req, res) {
    var handler = handlers[req.url]
    handler(req, res, function(err) {
      res.statusCode = 404
      res.end('no such location')
    })
  }).listen(7777)
}

var handlerOpts = []
for (var repo in config) {
  handlerOpts.push({path: repo, secret: config[repo].secret});
}

var handler = generaterHandler(handlerOpts)
