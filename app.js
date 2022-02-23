const express = require("express");
require("dotenv").config(".env");
const connectDB = require("./db/db");
const router = require("./routes/eventsRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();
const PORT = 3000;

//connect mongoDB
connectDB();
app.use(express.json());

//routers
app.use("/", router);
app.use("/", userRouter);

app.listen(PORT, console.log(`server is running on ${PORT}`));
