import { conf } from "../config.js";
import jwt from "jsonwebtoken";

export function verifyToken(req, res, next){
    try{
        if(!req.headers.authorization)
            throw new Error("No Valid Bearer Token in auth header");

        const token = req.headers.authorization.split(" ")[1];
        req.user = null;

        if(token){
            try{

                const decoded = jwt.verify(token, conf.JWT_KEY);
                req.user = decoded;
                next();

            }
            catch(error){
                console.log(error);
                return res.status(401).json({
                    message: "You are not authorized !"
                });
            }
        }
        else{
            return res.status(401).json({
                message: "You are not authorized !"
            });
        }
    }
    catch(error){
        console.log("error: ", error);
        return res.status(401).json({
            message: "Error Authorizing !",
            err: error.message
        });
    }
}

export function generateToken(payload) {
    return jwt.sign(payload, conf.JWT_KEY, { expiresIn: conf.JWT_EXPIRES_IN });
}
