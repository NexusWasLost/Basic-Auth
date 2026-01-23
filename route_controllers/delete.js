import express from "express";
import userModel from "../schema.js";
import { verifyToken } from "../middlewares/token.js";
import { checkReqBody } from "../middlewares/err.js";
import { verifyPassword } from "../utils/pass.js";

const router = express.Router();

router.delete("/delete-user", verifyToken, checkReqBody, delUser);

export default router;

async function delUser(req, res) {
    try {
        const user_id = req.user.sub;

        let user = await userModel.findById({ _id: user_id });
        if (!user)
            return res.status(404).json({ message: "No valid user found !" });

        const { password } = req.body;
        if (!password)
            return res.status(400).json({
                message: "Password is required for acc deletion"
            });

        if(!await verifyPassword(password, user.password))
            return res.status(401).json({ message: "Password is Incorrect !" });

        await userModel.findByIdAndDelete(user_id);

        res.status(204).json({
            message: "User deleted Successfully !"
        })

    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            message: "Oops 😳 ! Some Error Occured !"
        });
    }
}
