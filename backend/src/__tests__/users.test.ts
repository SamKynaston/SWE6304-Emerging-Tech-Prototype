import { GET_ALL_USERS } from "../services/user/user.controller";
import { Request, Response } from "express";
import { UserModel } from "../models";

jest.mock("../models", () => ({
    __esModule: true,

    UserModel: {
        findAll: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn()
    }
}))

const mockUsers = [
    { id: 0, email: "*", name: "System", password: "John Doe", dob: Date.now(), must_reset_password: false, can_be_signed_into: false, },
    { id: 1, email: "*", name: "Jane Doe", password: "test", dob: Date.now(), must_reset_password: false },
]

describe("User Controller", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;
    let sendMock: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();

        jsonMock = jest.fn().mockReturnValue({});
        sendMock = jest.fn().mockReturnValue({});
        statusMock = jest.fn().mockReturnThis();
        
        mockResponse = {
            status: statusMock,
            json: jsonMock,
            send: sendMock
        }

        mockRequest = {
            params: {},
            body: {}
        };
    });

    describe("GET_ALL_USERS", () => {
        it("Should return all users", async () => {
            (UserModel.findAll as jest.Mock).mockResolvedValue(mockUsers);

            await GET_ALL_USERS(mockRequest as Request, mockResponse as Response);
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({ body: mockUsers, success: true });
        });
    });
})