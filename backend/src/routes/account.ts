import { Router } from "express";
import auth, { IRequest } from "../middleware/auth";
import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import HttpStatusCode from "../util/statusCode";
const router = Router();
const prisma = new PrismaClient();

router.get('/', (req, res) => {
    res.send("Accounts Health Ok !");
})

router.get('/balance', auth, async (req: IRequest, res: Response) => {
    const account = await prisma.account.findUnique({
        where: { userId: req.userId },
    })

    if (!account) {
        console.error("account does not exist for this user");
        return;
    }

    res.status(HttpStatusCode.OK).json({
        balance: account.balance
    })
})

router.post('/transfer', auth, async (req: IRequest, res: Response) => {
    try {
        const { recipientId, amount } = req.body;

        // Start the transaction
        await prisma.$transaction(async (prisma) => {
            // Retrieve sender's account
            const senderAccount = await prisma.account.findUnique({
                where: { userId: req.userId },
                select: { id: true, balance: true }
            });

            // Retrieve recipient's account
            const recipientAccount = await prisma.account.findUnique({
                where: { userId: recipientId },
                select: { id: true, balance: true },
            });

            // Check if sender's account has sufficient balance
            if (!senderAccount || senderAccount.balance < amount) {
                throw new Error('Insufficient balance');
            }

            // Deduct amount from sender's account
            await prisma.account.update({
                where: { id: senderAccount.id },
                data: { balance: senderAccount.balance - amount },
            });

            // Add amount to recipient's account
            if (recipientAccount) {
                await prisma.account.update({
                    where: { id: recipientAccount.id },
                    data: { balance: recipientAccount.balance + amount },
                });
            } else {
                throw new Error('Recipient account not found');
            }
        });

        res.status(200).json({ message: 'Transfer successful' });
    } catch (error) {
        console.error('Error transferring money:', error);
        res.status(500).json({ message: 'Error transferring money' });
    }
});



export default router;