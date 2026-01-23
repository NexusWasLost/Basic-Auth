import express from "express";
import { conf } from "./config.js";
import db from "./database.js";

const app = express();

app.listen(conf.PORT, function(){
    console.log(`Server active n PORT: ${conf.PORT}`);
})

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//import and use routes
import _signup from "./route controllers/signup.js";
import _login from "./route controllers/login.js";

app.use("/api", _signup);
app.use("/api", _login);

//basic route
app.get("/", function(req, res){
    res.status(200).json({ message: "Hi from Basic Auth !" });
})

//handle wrong requests
app.use(function (req, res){
    res.status(404).json({ "message": "Oops! Looks like this path doesn't lead anywhere. Try a different route! 🚀"  })
})
