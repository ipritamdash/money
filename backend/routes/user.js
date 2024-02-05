const express = require("express");
const { User } = require("../db");  // equivalent to const { User } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware")
const zod = require("zod");
const router = express.Router();
// signup and signin routes

const signupSchema = zod.object({
    username: zod.string().email(),
    firstname: zod.string(),
    lastname: zod.string(),
    password: zod.string()
})

router.post("/signup", async (req, res) => {
    const body = req.body;
    const { success } = signupSchema.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const user = await User.findOne({  // may delete the await
        username: body.username
    })

    if (user._id) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const dbUser = await User.create(body);
    var hashedPassword = await dbUser.createHash(req.body.password);
    dbUser.password_hash = hashedPassword;
    const token = jwt.sign({
        userId: dbUser._id
    }, JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token
    })
})


const signinSchema = zod.object({
    username: zod.string().email(),
    password: zod.string()
})

router.post("signin", async (req, res) => {
    const body = req.body;
    const { success } = signinSchema.safeparse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }
    const user = await User.findOne({
        username: body.username,
        password: body.password
    })

    if (user._id) {
        const token = jwt.sign({
        }, JWT_SECRET);
        res.json({
            token: token
        })
        return;  //The return; statement is used to exit the function or block, preventing further execution of code.
    }

    res.status(411).json({
        message: "Error while logging in"
    })

})


const updateBody = zod.object({
    password: zod.string().optional(),
    firstname: zod.string().optional(),
    lastname: zod.string().optional()
})

router.put("/", async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Error while updating information"
        })
    }
    await User.updateOne(req.body, {
        _id: req.userId
    })
    res.json({
        message: "Updated successfully"
    })
})



module.exports = router;

