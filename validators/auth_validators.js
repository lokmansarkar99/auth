import z from 'zod'

export const registerUserSchema = z.object({
    name: z
    .string()
    .trim()
    .min(3,{message: 'Name must be at least 3 characters long'})
    .max(100, {message: 'Name must be at most 100 characters long'}),

    email:z
    .string()
    .trim()
    .email({message: 'Enter a valid email address'})
    .min(5, {message: 'Email must be at least 5 characters long'})
    .max(100, {message: 'Email must be at most 100 characters long'}),

    password: z
    .string()
    .trim()
    .min(8, {message: 'Password must be at least 8 characters long'})
    .max(100, {message: 'Password must be at most 100 characters long'})
    

})

export const loginUserSchema = z.object({
    email: z
    .string()
    .trim()
    .email({message: 'Enter a valid email address'})
    .min(5, {message: 'Email must be at least 5 characters long'})
    .max(100, {message: 'Email must be at most 100 characters long'}),

    password: z
    .string()
    .trim()
    .min(8, {message: 'Password must be at least 8 characters long'})
    .max(100, {message: 'Password must be at most 100 characters long'})
 })