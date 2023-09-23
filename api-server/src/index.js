const app = require("./app");
const { port } = require("./configs/config");

const server = app.listen(port, () => {
  console.log(`Server running on: http://localhost:${port}`);
});

process.on("SIGINT", () => {
  console.log("Stopping server");
  server.close(() => {
    console.log("Server stopped");
  });
  //notify
});
