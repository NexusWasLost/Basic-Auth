import { conf } from "./config.js"
import mongoose from "mongoose";

const LOCAL_DB_URL = "mongodb://localhost:27017/basic-auth";
mongoose.connect(conf.DB_URL || LOCAL_DB_URL);

let db = mongoose.connection;

//server event listeners
db.on("connected", function() {
    console.log("Connected to database");
})

db.on("disconnected", function() {
    console.log("Disconnected from database");
})

db.on("error", function(error) {
    console.log("MongoDB connection error" + error);
})

export default db;
