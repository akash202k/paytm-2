"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../util/config"));
const statusCode_1 = __importDefault(require("../util/statusCode"));
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authorization = req.header("authorization");
    // check auth header 
    if (!authorization) {
        console.log("authentication header missing ...");
        res.status(statusCode_1.default.UNAUTHORIZED).json({
            error: "Header Missing"
        });
        return;
    }
    try {
        // verify jwt
        const token = authorization.split(' ')[1];
        const decode = yield jsonwebtoken_1.default.verify(token, config_1.default);
        // add userId to req
        req.userId = decode.id;
        console.log(decode);
        next();
    }
    catch (error) {
        console.log(error);
        res.status(statusCode_1.default.UNAUTHORIZED).json({ error: "access denied" });
        return;
    }
});
exports.default = auth;
