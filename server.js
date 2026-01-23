import express from "express";
import { conf } from "./config.js";
import db from "./database.js";

const app = express();

app.listen(conf.PORT, function(){
    console.log(`Server active PORT: ${conf.PORT}`);
})

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//import and use routes
import _signup from "./route_controllers/signup.js";
import _login from "./route_controllers/login.js";
import _dashboard from "./route_controllers/dashboard.js";
import _update from "./route_controllers/update.js";
import _delete from "./route_controllers/delete.js";

app.use("/api", _signup);
app.use("/api", _login);
app.use("/api", _dashboard);
app.use("/api", _update);
app.use("/api", _delete);

//basic route
app.get("/", function(req, res){
    res.status(200).json({ message: "Hi from Basic Auth !" });
})

//handle wrong requests
app.use(function (req, res){
    res.status(404).json({ "message": "Oops! Looks like this path doesn't lead anywhere. Try a different route! 🚀"  })
})
