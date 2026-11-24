import { CREATE_USER, GET_ALL_USERS, GET_USER } from "../services/user/user.controller";
import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import { authenticateExistingUser, registerNewUser } from "../utils/user";

jest.mock("../models/user.model", () => ({
    __esModule: true,

    UserModel: {
        findAll: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn()
    },
}))

jest.mock("../models/role.model", () => ({
    __esModule: true,
    RoleModel: {
        findOne: jest.fn(),
    },
}));

jest.mock("../utils/user", () => ({
    registerNewUser: jest.fn(),
    authenticateExistingUser: jest.fn(),
}));

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
    let cookieMock: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();

        jsonMock = jest.fn().mockReturnValue({});
        sendMock = jest.fn().mockReturnValue({});
        statusMock = jest.fn().mockReturnThis();
        cookieMock = jest.fn().mockReturnThis();
        
        mockResponse = {
            status: statusMock,
            json: jsonMock,
            send: sendMock,
            cookie: cookieMock,
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

    describe("GET_USER", () => {
        it("Should return a specified user", async () => {
            (UserModel.findOne as jest.Mock).mockResolvedValue(mockUsers[0]);

            mockRequest.params = { id: "0" };

            await GET_USER(mockRequest as Request, mockResponse as Response);
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({ body: mockUsers[0], success: true });
        });
    });

    describe("CREATE_USER", () => {
        it("Should create a new user and then return it", async () => {
            (registerNewUser as jest.Mock).mockResolvedValue(undefined);
            (authenticateExistingUser as jest.Mock).mockResolvedValue("test-token");

            mockRequest.body = {
                email: "jane@example.com",
                forename: "Jane",
                surname: "Doe",
                password: "test",
            };

            await CREATE_USER(mockRequest as Request, mockResponse as Response);
            expect(statusMock).toHaveBeenCalledWith(201);
            expect(jsonMock).toHaveBeenCalledWith({ success: true });
            expect(registerNewUser).toHaveBeenCalledWith("jane@example.com", "Jane", "Doe", "test");
            expect(authenticateExistingUser).toHaveBeenCalledWith("jane@example.com", "test");
            expect(cookieMock).toHaveBeenCalledWith("SESSION_TOKEN", "test-token", expect.any(Object));
        })
    })
})