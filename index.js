const express = require("express");
require("dotenv").config();
const routes = require("./routes");
const app = express();

//connect to db
const connectDB = require("./utils/dbConnect");
connectDB();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

//routes
app.use(routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
