import express from "express";
import userModel from "../schema.js";
import { verifyToken } from "../middlewares/token.js";
import { hashPassword, verifyPassword } from "../utils/pass.js";
import { testMail } from "../utils/validator.js";
import { checkReqBody } from "../middlewares/err.js";

const router = express.Router();

router.put("/update", verifyToken, checkReqBody, update);
router.put("/update-pass", verifyToken, checkReqBody, updatePassword);

export default router;

async function update(req, res) {
    try {

        //expected params: newName, newEmail, password
        const user_id = req.user.sub;

        let user = await userModel.findById({ _id: user_id });
        if (!user)
            return res.status(404).json({ message: "No valid user found !" });

        const { password } = req.body;
        if (!password)
            return res.status(400).json({
                message: "Password is required for update"
            })

        let update = {};
        let allowedFields = {
            newEmail: "email",
            newName: "name"
        }
        //remove any undefined
        //for in, returns the key
        for (const field in allowedFields) {
            //check value for that key
            if (req.body[field] !== undefined) {
                //update's key is value of allowed fields
                update[allowedFields[field]] = req.body[field];
            }
        }
        /*
        From the expected params (newName, newEmail), we map this to DB field name.
        That is: newEmail (as in param) -> email (as in DB schema)
        this helps to directly set values by doing { $set: update }
        and removes the need to manually map things
        */

        //When nothing is there to update
        if (Object.keys(update).length === 0) {
            return res.status(400).json({
                message: "Nothing to Update"
            });
        }

        if (update.email) {
            //if a new email is provided it must be a valid one
            if (!testMail(update.email))
                return res.status(400).json({ message: "Email must be valid !" });

            //check that the new mail doesnt exists for another acc but ignore self email
            if (await userModel.findOne({
                email: update.email,
                _id: { $ne: user_id }
            })) return res.status(409).json({
                message: "New Email is already registered !"
            });

        }

        if (!await verifyPassword(password, user.password))
            return res.status(401).json({ message: "Password is Incorrect !" });

        await userModel.findByIdAndUpdate(
            user_id,
            { $set: update },
            { runValidators: true, new: true }
        );

        res.status(200).json({
            message: "User updated Successfully ✅ !",
        });
    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            message: "Oops 😳 ! Some Error Occured !"
        });
    }
}

async function updatePassword(req, res) {
    try {
        const user_id = req.user.sub;

        let user = await userModel.findById({ _id: user_id });
        if (!user)
            return res.status(404).json({ message: "No valid user found !" });

        const { password, newPassword, confNewPassword } = req.body;
        if (!password || !newPassword || !confNewPassword)
            return res.status(400).json({
                message: "Old Password and New Passwords should be provided"
            });

        if (newPassword !== confNewPassword)
            return res.status(400).json({
                message: "New Passwords should match"
            })

        //check if old password is correct
        if (!await verifyPassword(password, user.password))
            return res.status(401).json({ message: "Old password is Incorrect !" });

        //new pass must not be same as old pass
        if (password === newPassword)
            return res.status(400).json({
                message: "New password must be different from old password"
            });

        //hash new password
        const hashedNewPassword = await hashPassword(newPassword);
        //update in DB
        await userModel.findByIdAndUpdate(
            user_id,
            { $set: { password: hashedNewPassword } },
            { runValidators: true, new: true }
        );

        res.status(200).json({
            message: "Password updated Successfully ✅ !",
        });

    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            message: "Oops 😳 ! Some Error Occured !"
        });
    }
}
