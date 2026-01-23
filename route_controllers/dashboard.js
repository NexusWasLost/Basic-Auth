import express from "express";
import { verifyToken } from "../middlewares/token.js";
import userModel from "../schema.js";

const router = express.Router();

router.get("/dashboard", verifyToken, getData);

export default router;

async function getData(req, res) {
    try {
        const user_id = req.user.sub;

        let user = await userModel.findById({ _id: user_id });
        if (!user)
            return res.status(404).json({ message: "No valid user found !" });

        res.status(200).json({
            authenticated: true,
            userInfo: {
                email: user.email,
                name: user.name,
                created: user.createdOn
            }
        });

    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            message: "Oops 😳 ! Some Error Occured !"
        });
    }
}
