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
const express_1 = require("express");
const schema_1 = __importDefault(require("../zod/schema"));
const statusCode_1 = __importDefault(require("../util/statusCode"));
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../util/config"));
const auth_1 = __importDefault(require("../middleware/auth"));
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.get('/', (req, res) => {
    res.send("User Health Ok !");
});
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validation = schema_1.default.userSignUp.safeParse(req.body);
    if (!validation.success) {
        console.log(validation.error.issues);
        res.status(statusCode_1.default.CONFLICT).json(validation.error.issues);
        return;
    }
    // check either user exist with same username
    const isUserExist = yield prisma.user.findUnique({ where: { username: req.body.username } });
    if (isUserExist) {
        console.log(`${req.body.username} alredy exist.`);
        res.status(statusCode_1.default.CONFLICT).json({
            message: "Email already taken / Incorrect inputs"
        });
        return;
    }
    const newUser = yield prisma.user.create({
        data: req.body
    });
    console.log(newUser);
    const jwtToken = jsonwebtoken_1.default.sign({ id: newUser.id }, config_1.default);
    const token = `Bearer ${jwtToken}`;
    res.status(statusCode_1.default.OK).json({
        message: "User created successfully",
        token: token
    });
}));
router.post('/signin', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    console.log(userId);
    if (!userId) {
        console.log(`${userId} Not Found`);
        res.status(statusCode_1.default.NOT_FOUND).json({ error: `userId not found` });
        return;
    }
    try {
        const jwtToken = yield jsonwebtoken_1.default.sign({ id: userId }, config_1.default);
        const token = `Bearer ${jwtToken}`;
        res.status(statusCode_1.default.OK).json({ token: token });
    }
    catch (error) {
        console.log(error);
        res.status(statusCode_1.default.UNAUTHORIZED).json({
            message: "Error while logging in"
        });
    }
}));
router.put('/', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validation = schema_1.default.updateUser.safeParse(req.body);
    if (!validation.success) {
        console.log(validation.error.issues);
        res.status(statusCode_1.default.CONFLICT).json(validation.error.issues);
        return;
    }
    const updateUser = yield prisma.user.update({
        where: { id: req.userId },
        data: req.body
    });
    console.log(updateUser);
    res.status(statusCode_1.default.OK).json({
        message: "User Info Updated",
        User: updateUser
    });
}));
exports.default = router;
