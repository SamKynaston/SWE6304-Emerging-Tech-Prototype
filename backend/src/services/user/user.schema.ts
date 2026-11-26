import * as zod from "zod";

export const UserAuthenticationSchema = zod.object({
    email: zod.string(),
    password: zod.string()
}).strict();

export const UserCreationSchema = zod.object({
    email: zod.string(),
    forename: zod.string(),
    surname: zod.string(),
    password: zod.string(),
    dob: zod.coerce.date(),
}).strict();

export const UserUpdateSchema = zod.object({
    email: zod.string(),
    forename: zod.string(),
    surname: zod.string(),
    dob: zod.coerce.date().optional(),
});