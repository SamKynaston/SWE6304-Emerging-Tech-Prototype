import { AUTHENTICATE_USER, CHECK_AUTHENTICATION, CREATE_USER, GET_ALL_USERS, GET_USER, LOGOUT_USER, UPDATE_USER } from "../services/user/user.controller";
import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/user.model";
import { authenticateExistingUser, issueUserToken, registerNewUser, updateUser } from "../utils/user";
import { UserCreationSchema, UserUpdateSchema } from "../services/user/user.schema";
import { OWNERSHIP_CHECK } from "../middleware/validate.middleware";

jest.mock("../models", () => ({
    __esModule: true,
    UserModel: { findOne: jest.fn() },
    RoleModel: {},
    PermissionModel: {},
}));

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
    updateUser: jest.fn(),
    issueUserToken: jest.fn(),
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

    describe("CHECK_AUTHENTICATION", () => {
        it("returns the authenticated user with their role and force-reset state", async () => {
            const user = {
                ...mockUsers[1],
                must_reset_password: true,
                role: { permissions: [] },
            };
            (UserModel.findOne as jest.Mock).mockResolvedValue(user);
            mockRequest.user = { id: mockUsers[1].id, email: mockUsers[1].email } as NonNullable<Request["user"]>;

            await CHECK_AUTHENTICATION(mockRequest as Request, mockResponse as Response);

            expect(UserModel.findOne).toHaveBeenCalledWith(expect.objectContaining({
                where: { email: mockUsers[1].email },
                attributes: { exclude: ["password"] },
            }));
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                body: user,
                success: true,
                forceReset: true,
            });
        });

        it("returns 401 when no authenticated user is attached to the request", async () => {
            await CHECK_AUTHENTICATION(mockRequest as Request, mockResponse as Response);

            expect(UserModel.findOne).not.toHaveBeenCalled();
            expect(statusMock).toHaveBeenCalledWith(401);
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

    describe("UserUpdateSchema", () => {
        it("Should coerce a date string to a Date", () => {
            const result = UserUpdateSchema.safeParse({
                email: "jane@example.com",
                forename: "Jane",
                surname: "Doe",
                dob: "1990-01-01",
            });

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.dob).toEqual(new Date("1990-01-01"));
            }
        });
    })

    describe("OWNERSHIP_CHECK", () => {
        let req: Partial<Request>;
        let res: Partial<Response>;
        let statusMock: jest.Mock;
        let jsonMock: jest.Mock;
        let nextMock: jest.Mock;

        beforeEach(() => {
            req = { params: {} };
            statusMock = jest.fn().mockReturnThis();
            jsonMock = jest.fn();
            nextMock = jest.fn();
            res = { status: statusMock, json: jsonMock };
        });

        it("allows a user to access their own account", async () => {
            req.params = { id: String(mockUsers[1].id) };
            req.user = mockUsers[1] as unknown as NonNullable<Request["user"]>;

            await OWNERSHIP_CHECK(req as Request, res as Response, nextMock as NextFunction);

            expect(nextMock).toHaveBeenCalledTimes(1);
            expect(statusMock).not.toHaveBeenCalled();
        });

        it("allows an administrator to access another account", async () => {
            req.params = { id: String(mockUsers[1].id) };
            req.user = {
                ...mockUsers[0],
                role: { permissions: [{ permission_string: "ADMINISTRATOR" }] },
            } as unknown as NonNullable<Request["user"]>;

            await OWNERSHIP_CHECK(req as Request, res as Response, nextMock as NextFunction);

            expect(nextMock).toHaveBeenCalledTimes(1);
        });

        it("rejects a user who does not own the account", async () => {
            req.params = { id: String(mockUsers[1].id) };
            req.user = {
                ...mockUsers[0],
                role: { permissions: [] },
            } as unknown as NonNullable<Request["user"]>;

            await OWNERSHIP_CHECK(req as Request, res as Response, nextMock as NextFunction);

            expect(nextMock).not.toHaveBeenCalled();
            expect(statusMock).toHaveBeenCalledWith(403);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                error: "Unauthorised.",
            });
        });

        it("rejects a request without an authenticated user", async () => {
            req.params = { id: String(mockUsers[1].id) };

            await OWNERSHIP_CHECK(req as Request, res as Response, nextMock as NextFunction);

            expect(nextMock).not.toHaveBeenCalled();
            expect(statusMock).toHaveBeenCalledWith(400);
        });

        it("rejects an array route id", async () => {
            req.params = { id: ["0", "1"] };
            req.user = mockUsers[0] as unknown as NonNullable<Request["user"]>;

            await OWNERSHIP_CHECK(req as Request, res as Response, nextMock as NextFunction);

            expect(nextMock).not.toHaveBeenCalled();
            expect(statusMock).toHaveBeenCalledWith(400);
        });
    });

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

    describe("UPDATE_USER", () => {
        it("Should update the requested user and issue a new session token", async () => {
            (updateUser as jest.Mock).mockResolvedValue(true);
            (issueUserToken as jest.Mock).mockResolvedValue("test-token");
            const dob = new Date("1990-01-01T00:00:00.000Z");
            mockRequest.params = { id: "12" };
            mockRequest.body = {
                email: "jane@example.com",
                forename: "Jane",
                surname: "Doe",
                dob,
            };

            await UPDATE_USER(mockRequest as Request, mockResponse as Response);

            expect(updateUser).toHaveBeenCalledWith(12, mockRequest.body);
            expect(issueUserToken).toHaveBeenCalledWith(12);
            expect(cookieMock).toHaveBeenCalledWith(
                "SESSION_TOKEN",
                "test-token",
                expect.objectContaining({ httpOnly: true, path: "/" }),
            );
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({ success: true });
        });

        it("Should return success false when the user does not exist", async () => {
            (updateUser as jest.Mock).mockResolvedValue(false);
            mockRequest.params = { id: "99" };
            mockRequest.body = { email: "jane@example.com" };

            await UPDATE_USER(mockRequest as Request, mockResponse as Response);

            expect(updateUser).toHaveBeenCalledWith(99, mockRequest.body);
            expect(issueUserToken).not.toHaveBeenCalled();
            expect(cookieMock).not.toHaveBeenCalled();
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({ success: false });
        });

        it("Should reject an array route id", async () => {
            mockRequest.params = { id: ["12", "13"] };

            await UPDATE_USER(mockRequest as Request, mockResponse as Response);

            expect(updateUser).not.toHaveBeenCalled();
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ success: false });
        });
    })
})