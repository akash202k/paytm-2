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
const auth_1 = __importDefault(require("../middleware/auth"));
const client_1 = require("@prisma/client");
const statusCode_1 = __importDefault(require("../util/statusCode"));
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.get('/', (req, res) => {
    res.send("Accounts Health Ok !");
});
router.get('/balance', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const account = yield prisma.account.findUnique({
        where: { userId: req.userId },
    });
    if (!account) {
        console.error("account does not exist for this user");
        return;
    }
    res.status(statusCode_1.default.OK).json({
        balance: account.balance
    });
}));
router.post('/transfer', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { recipientId, amount } = req.body;
        // Start the transaction
        yield prisma.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            // Retrieve sender's account
            const senderAccount = yield prisma.account.findUnique({
                where: { userId: req.userId },
                select: { id: true, balance: true }
            });
            // Retrieve recipient's account
            const recipientAccount = yield prisma.account.findUnique({
                where: { userId: recipientId },
                select: { id: true, balance: true },
            });
            // Check if sender's account has sufficient balance
            if (!senderAccount || senderAccount.balance < amount) {
                throw new Error('Insufficient balance');
            }
            // Deduct amount from sender's account
            yield prisma.account.update({
                where: { id: senderAccount.id },
                data: { balance: senderAccount.balance - amount },
            });
            // Add amount to recipient's account
            if (recipientAccount) {
                yield prisma.account.update({
                    where: { id: recipientAccount.id },
                    data: { balance: recipientAccount.balance + amount },
                });
            }
            else {
                throw new Error('Recipient account not found');
            }
        }));
        res.status(200).json({ message: 'Transfer successful' });
    }
    catch (error) {
        console.error('Error transferring money:', error);
        res.status(500).json({ message: 'Error transferring money' });
    }
}));
exports.default = router;
