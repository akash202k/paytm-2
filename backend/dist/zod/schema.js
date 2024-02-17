"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const userSignUp = zod_1.z.object({
    username: zod_1.z.string().email(),
    password: zod_1.z.string().min(5),
    firstName: zod_1.z.string().min(2),
    lastName: zod_1.z.string().min(2)
});
const userSignIn = zod_1.z.object({
    username: zod_1.z.string().email(),
    password: zod_1.z.string().min(5)
});
const updateUser = zod_1.z.object({
    username: zod_1.z.string().optional(),
    firstName: zod_1.z.string().optional(),
    lastName: zod_1.z.string().optional()
});
const ZodSchema = {
    userSignUp,
    userSignIn,
    updateUser
};
exports.default = ZodSchema;
