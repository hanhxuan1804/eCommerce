const mongoose = require("mongoose");
const { dbstring } = require("../configs/config");
class Database {
  constructor() {
    this.connect();
  }

  connect(
    type = "mongodb" //default: mongodb
  ) {
    //if dev:
    mongoose.set("debug", true);
    mongoose.set("debug", { color: true });
    mongoose
      .connect(dbstring)
      .then((_) => {
        console.log(`Connected to mongodb success!`);
        require("../helpers/check.connect").countConnect();
      })
      .catch((err) => console.log(err));
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
