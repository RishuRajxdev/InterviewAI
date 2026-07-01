require("dotenv").config();
const app = require("./src/app.js");
const connectDB = require("./src/config/database");

const Port = process.env.PORT || 3000;
connectDB();
app.listen(Port,() => {

  console.log(`SERVER  STARTED LISTENING ON ${Port}`);
});
