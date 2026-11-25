import {
    AUTHENTICATE_USER,
    CREATE_USER,
    GET_ALL_USERS,
    GET_USER,
    LOGOUT_USER,
} from "../services/user/user.controller";
import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import { authenticateExistingUser, registerNewUser } from "../utils/user";
import { UserCreationSchema } from "../services/user/user.schema";

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
    let clearCookieMock: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();

        jsonMock = jest.fn().mockReturnValue({});
        sendMock = jest.fn().mockReturnValue({});
        statusMock = jest.fn().mockReturnThis();
        cookieMock = jest.fn().mockReturnThis();
        clearCookieMock = jest.fn().mockReturnThis();
        
        mockResponse = {
            status: statusMock,
            json: jsonMock,
            send: sendMock,
            cookie: cookieMock,
            clearCookie: clearCookieMock,
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

        it("Should reject a non-numeric user id without querying the database", async () => {
            mockRequest.params = { id: "not-a-number" };

            await GET_USER(mockRequest as Request, mockResponse as Response);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(UserModel.findOne).not.toHaveBeenCalled();
        });

        it("Should reject requests without an id or authenticated user", async () => {
            await GET_USER(mockRequest as Request, mockResponse as Response);

            expect(statusMock).toHaveBeenCalledWith(401);
            expect(UserModel.findOne).not.toHaveBeenCalled();
        });

        it("Should use the authenticated user's id when no route id is provided", async () => {
            (UserModel.findOne as jest.Mock).mockResolvedValue(mockUsers[0]);
            mockRequest.user = { id: 12 } as NonNullable<Request["user"]>;

            await GET_USER(mockRequest as Request, mockResponse as Response);

            expect(UserModel.findOne).toHaveBeenCalledWith(expect.objectContaining({
                where: { id: 12 },
            }));
            expect(statusMock).toHaveBeenCalledWith(200);
        });

        it("Should return 404 when the requested user does not exist", async () => {
            (UserModel.findOne as jest.Mock).mockResolvedValue(null);
            mockRequest.params = { id: "99" };

            await GET_USER(mockRequest as Request, mockResponse as Response);

            expect(UserModel.findOne).toHaveBeenCalledWith(expect.objectContaining({
                where: { id: 99 },
            }));
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({ body: null, success: false });
        });
    });

    describe("CREATE_USER", () => {
        it("Should reject signup data without a date of birth", () => {
            const result = UserCreationSchema.safeParse({
                email: "jane@example.com",
                forename: "Jane",
                surname: "Doe",
                password: "test",
            });

            expect(result.success).toBe(false);
        });

        it("Should create a new user and then return it", async () => {
            (registerNewUser as jest.Mock).mockResolvedValue(undefined);
            (authenticateExistingUser as jest.Mock).mockResolvedValue("test-token");

            const dob = new Date("1990-01-01T00:00:00.000Z");
            mockRequest.body = {
                email: "jane@example.com",
                forename: "Jane",
                surname: "Doe",
                password: "test",
                dob,
            };

            await CREATE_USER(mockRequest as Request, mockResponse as Response);
            expect(statusMock).toHaveBeenCalledWith(201);
            expect(jsonMock).toHaveBeenCalledWith({ success: true });
            expect(registerNewUser).toHaveBeenCalledWith("jane@example.com", "Jane", "Doe", "test", dob);
            expect(authenticateExistingUser).toHaveBeenCalledWith("jane@example.com", "test");
            expect(cookieMock).toHaveBeenCalledWith("SESSION_TOKEN", "test-token", expect.any(Object));
        })
    })

    describe("AUTHENTICATE_USER", () => {
        it("Should authenticate the user, set the session cookie, and return success", async () => {
            (authenticateExistingUser as jest.Mock).mockResolvedValue("test-token");
            mockRequest.body = { email: "jane@example.com", password: "test" };

            await AUTHENTICATE_USER(mockRequest as Request, mockResponse as Response);

            expect(authenticateExistingUser).toHaveBeenCalledWith("jane@example.com", "test");
            expect(cookieMock).toHaveBeenCalledWith(
                process.env.SESSION_TOKEN_NAME || "SESSION_TOKEN",
                "test-token",
                expect.objectContaining({
                    httpOnly: true,
                    path: "/",
                }),
            );
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({ success: true });
        });

        it("Should return an error response when authentication fails", async () => {
            (authenticateExistingUser as jest.Mock).mockRejectedValue(new Error("Invalid credentials"));
            mockRequest.body = { email: "jane@example.com", password: "wrong" };

            await AUTHENTICATE_USER(mockRequest as Request, mockResponse as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: "Incorrect credentials",
            });
            expect(cookieMock).not.toHaveBeenCalled();
        });
    });

    describe("LOGOUT_USER", () => {
        it("Should clear the session cookie and return success", async () => {
            await LOGOUT_USER(mockRequest as Request, mockResponse as Response);

            expect(clearCookieMock).toHaveBeenCalledWith(
                process.env.SESSION_TOKEN_NAME || "SESSION_TOKEN",
                expect.objectContaining({
                    httpOnly: true,
                    path: "/",
                }),
            );
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({ success: true });
        });

        it("Should return an error response when clearing the session cookie fails", async () => {
            clearCookieMock.mockImplementationOnce(() => {
                throw new Error("Unable to clear cookie");
            });

            await LOGOUT_USER(mockRequest as Request, mockResponse as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ success: false });
        });
    });
})