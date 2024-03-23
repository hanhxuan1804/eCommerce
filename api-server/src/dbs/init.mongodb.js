const mongoose = require("mongoose");
const { dbstring } = require("../configs");
class Database {
  constructor() {
    // this.connect();
  }

  async connect(
    type = "mongodb" //default: mongodb
  ) {
    //if dev:
    mongoose.set("debug", true);
    mongoose.set("debug", { color: true });
    await mongoose
      .connect(dbstring)
      .then((_) => {
        console.log(`Connected to mongodb success!`);
        require("../helpers/check.connect").countConnect();
      })
      .catch((err) => console.log(err));
  }
  async close() {
   await mongoose.connection.close();
  }
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;
