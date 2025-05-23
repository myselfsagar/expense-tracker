const express = require("express");
require("dotenv").config();
const routes = require("./routes");
const app = express();

//connect to db
const dbConnection = require("./utils/dbConnect");

//models
require("./models/index");

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

//routes
app.use(routes);

(async () => {
  try {
    await dbConnection.sync({ force: false });
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running at ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
})();
