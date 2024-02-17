import { Router } from "express";
import userRouter from "./user";
import accountRouter from "./account";

const router = Router();


router.get('/', (req, res) => {
    res.send("v1 Health Ok !");
})

router.use('/user', userRouter);
router.use('/account', accountRouter);


export default router;