import { UserModel } from "./user.model";

export async function seedSampleUserData() {
    await UserModel.bulkCreate([
        { id: 0, email: "*", name: "System", password: "2eewe", dob: Date.now(), must_reset_password: false },
        { id: 1, email: "sam.kynaston@kynno.co.uk", name: "Sam Kynaston", password: "test", dob: Date.now(), must_reset_password: false },
        { id: 2, email: "john.doe@kynno.co.uk", name: "John Doe", password: "t", dob: Date.now(), must_reset_password: true },
        { id: 3, email: "jane.doe@kynno.co.uk", name: "Jane Doe", password: "test", dob: Date.now(), must_reset_password: false },
    ])
}