const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const fileRoutes = require("./routes/file.js");
const connectDb = require("./config/db.js");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use("/file", fileRoutes);

app.get("/", (req, res) => {
    res.json({message: "Welcome to the app!"})
})

const port = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await connectDb();
    app.listen(port, () =>
      console.log(`DB is connected and Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

startServer();
