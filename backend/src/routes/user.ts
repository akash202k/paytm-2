import { Router } from "express";
import zodSchema from "../zod/schema"
import HttpStatusCode from "../util/statusCode";
import { Account, PrismaClient, User } from "@prisma/client";
import jwt from "jsonwebtoken";
import secret from "../util/config";
import auth from "../middleware/auth";
import { IRequest } from "../middleware/auth"
import { Response } from "express";

const router = Router();
const prisma = new PrismaClient();

router.get('/', (req, res) => {
    res.send("User Health Ok !");
})


// signIn
router.post('/signup', async (req, res) => {

    await prisma.$transaction(async (prisma) => {
        const validation = zodSchema.userSignUp.safeParse(req.body);
        if (!validation.success) {
            console.log(validation.error.issues);
            res.status(HttpStatusCode.CONFLICT).json(validation.error.issues);
            return;
        }

        // check either user exist with same username
        const isUserExist = await prisma.user.findUnique({ where: { username: req.body.username } });

        if (isUserExist) {
            console.log(`${req.body.username} alredy exist.`);
            res.status(HttpStatusCode.CONFLICT).json({
                message: "Email already taken / Incorrect inputs"
            })
            return;
        }

        const newUser: User = await prisma.user.create({
            data: req.body
        })

        // create account in account table now 
        const newAccount: Account = await prisma.account.create({
            data: { userId: newUser.id }
        })

        console.log("new account created \n", newAccount);

        console.log(newUser);

        const jwtToken: string = jwt.sign({ id: newUser.id }, secret);
        const token: string = `Bearer ${jwtToken}`;

        res.status(HttpStatusCode.OK).json({
            message: "User created successfully",
            token: token
        })

    })


})


// signIn
router.post('/signin', auth, async (req: IRequest, res: Response) => {

    const userId = req.userId;
    console.log(userId)
    if (!userId) {
        console.log(`${userId} Not Found`);
        res.status(HttpStatusCode.NOT_FOUND).json({ error: `userId not found` });
        return;
    }

    try {
        const jwtToken: string = await jwt.sign({ id: userId }, secret);
        const token: string = `Bearer ${jwtToken}`;

        res.status(HttpStatusCode.OK).json({ token: token });
    } catch (error) {
        console.log(error);
        res.status(HttpStatusCode.UNAUTHORIZED).json({
            message: "Error while logging in"
        })
    }
})


// update
router.put('/', auth, async (req: IRequest, res: Response) => {
    const validation = zodSchema.updateUser.safeParse(req.body);
    if (!validation.success) {
        console.log(validation.error.issues);
        res.status(HttpStatusCode.CONFLICT).json(validation.error.issues);
        return;
    }

    const updateUser = await prisma.user.update({
        where: { id: req.userId },
        data: req.body
    })

    console.log(updateUser);

    res.status(HttpStatusCode.OK).json({
        message: "User Info Updated",
        User: updateUser
    })
})



export default router;