const http = require("http");
const next = require("next");

process.env.NODE_ENV = "production";

const port = process.env.PORT || 3000;

const app = next({
  dev: false,
  dir: __dirname,
  hostname: "localhost",
  port: Number(port),
});

const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    http.createServer((req, res) => {
      handle(req, res);
    })
    .listen(port, () => {
      console.log(`Next.js server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
