const mongoose = require('mongoose');
const os = require('os')
const process = require('process')
const _SECONDS = 5000;

//count number connection to db
const countConnect = () => {
  const num = mongoose.connections.length;
  console.log(`Number connection to DB: ${num}`);
};
//check overload
const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numcore = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    // console.log(`Active connection: ${numConnection}`);
    // console.log(`Memory usage: ${memoryUsage/1024/1024} MB` );
    const maxConnection = numcore * 5;// Example each core can have 5 connection
    if(numConnection > maxConnection){
        console.log(`Connect overload detected!`);
        //notify
    }

  }, _SECONDS);//Moniter every 5 second
};

module.exports = {
  countConnect,
  checkOverload
};
