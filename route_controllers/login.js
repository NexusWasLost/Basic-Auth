import express from "express";
import userModel from "../schema.js";
import { conf } from "../config.js";
import { verifyPassword } from "../utils/pass.js";
import { createPayload } from "../utils/payload.js";
import { generateToken } from "../middlewares/token.js";
import { checkReqBody } from "../middlewares/err.js";

const router = express.Router();

router.post("/login", checkReqBody, login);

export default router;

async function login(req, res) {
    try {

        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ message: "Email and Password are required !" });

        //look for the user
        const user = await userModel.findOne({
            email: email
        });

        if (!user)
            return res.status(404).json({ message: "No valid user found !" });

        //check password
        if (!await verifyPassword(password, user.password))
            return res.status(401).json({ message: "Password is incorrect !" });

        //create payload and generate token
        const payload = createPayload(user.id.toString(), user.email);
        const token = generateToken(payload);

        res.status(200).json({
            message: "User Logged in Successfully ✅ !",
            token: token
        });
    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            message: "Oops 😳 ! Some Error Occured !"
        });
    }
}
