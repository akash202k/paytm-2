import { z } from "zod";

const userSignUp = z.object({
    username: z.string().email(),
    password: z.string().min(5),
    firstName: z.string().min(2),
    lastName: z.string().min(2)

})

const userSignIn = z.object({
    username: z.string().email(),
    password: z.string().min(5)
})

const updateUser = z.object({
    username: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional()
})

const ZodSchema = {
    userSignUp,
    userSignIn,
    updateUser
}

export default ZodSchema;
