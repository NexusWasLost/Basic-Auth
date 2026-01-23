import express from "express";
import userModel from "../schema.js";
import { hashPassword } from "../utils/pass.js"
import { testMail, testPass } from "../utils/validator.js";

const router = express.Router();

router.post("/signup", signup);

export default router;

//controller functions
async function signup(req, res) {
    try {

        const { email, password, name } = req.body;
        //check if mail or password is missing
        if (!email || !password)
            return res.status(400).json({ ErrMsg: "Email and password must be provided !" });

        //check if mail is a valid one
        if(!testMail(email))
            return res.status(400).json({ ErrMsg: "Email Must be valid !" });

        //check if user with mail already exists
        if(await userModel.findOne({ email: email }))
            return res.status(409).json({ ErrMsg: "Email already registered !" });

        //password validation check
        if (!testPass(password))
            return res.status(400).json({ ErrMsg: "Password must follow all the rules !" });

        let user = new userModel({ email, password, name });
        user.password = await hashPassword(user.password);

        await user.save();

        res.status(201).json({
            message: "User Created Successfully"
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
