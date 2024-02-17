import express from "express";
import rootRouter from "./routes/index"
import cors from "cors"
import HttpStatusCode from "./util/statusCode";
import { Request, Response, NextFunction } from 'express';


const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.status(HttpStatusCode.OK).json({ message: "Health Ok" })
})

app.use('/api/v1', rootRouter)

app.listen(port, () => {
    console.log(`paytm-2 backend running on port ${port}`);
})

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        error: "Internal Server Error"
    })
})