import express from "express";
import userModel from "../schema.js";
import { verifyPassword } from "../utils/pass.js";

const router = express.Router();

router.post("/login", login);

export default router;

async function login(req, res) {
    try {

        const { email, password } = req.body;

        if(!email || !password)
            return res.status(400).json({ ErrMsg: "Email and Password are required !" });

        //look for the user
        const user = await userModel.findOne({
            email: email
        });

        if (!user)
            return res.status(404).json({ message: "No valid user found !" });

        //check password
        if(!verifyPassword(password, user.password))
            return res.status(401).json({ message: "Password is incorrect !" });

        res.status(200).json({
            message: "User Logged in Successfully ✅ !",
            user: user
        });
    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).
            json(
                {
                    ErrMsg: "Oops 😳 ! Some Error Occured !"
                });
    }
}
