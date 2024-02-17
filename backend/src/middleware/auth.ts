import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import secret from "../util/config";
import HttpStatusCode from "../util/statusCode";

export interface IRequest extends Request {
    userId?: any; // Define the id property
}


const auth = async (req: IRequest, res: Response, next: NextFunction) => {
    const authorization = req.header("authorization");

    // check auth header 
    if (!authorization) {
        console.log("authentication header missing ...");
        res.status(HttpStatusCode.UNAUTHORIZED).json({
            error: "Header Missing"
        })
        return;
    }

    try {
        // verify jwt
        const token = authorization.split(' ')[1];
        const decode: any = await jwt.verify(token, secret);
        // add userId to req
        req.userId = decode.id;
        console.log(decode);
        next()
    } catch (error) {
        console.log(error);
        res.status(HttpStatusCode.UNAUTHORIZED).json({ error: "access denied" })
        return;

    }
}

export default auth;