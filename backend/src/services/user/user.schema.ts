import * as zod from "zod";

export const UserAuthenticationSchema = zod.object({
    email: zod.string(),
    password: zod.string()
}).strict();