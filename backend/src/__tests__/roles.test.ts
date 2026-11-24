import { GET_ALL_ROLES, GET_ROLE } from "../services/permissions/permissions.controller";
import { Request, Response } from "express";
import { RoleModel } from "../models";

jest.mock("../models", () => ({
    __esModule: true,

    RoleModel: {
        findAll: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn()
    }
}))

const mockRoles = [
    { id: 0, name: "Root"},
    { id: 1, name: "User" },
    { id: 2, name: "Admin" },
]

describe("Roles Controller", () => {
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

    describe("GET_ALL_ROLES", () => {
        it("Should return all roles", async () => {
            (RoleModel.findAll as jest.Mock).mockResolvedValue(mockRoles);

            await GET_ALL_ROLES(mockRequest as Request, mockResponse as Response);
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({ body: mockRoles, success: true });
        });
    });

    describe("GET_ROLE", () => {
        it("Should return a specified role", async () => {
            (RoleModel.findOne as jest.Mock).mockResolvedValue(mockRoles[0]);

            mockRequest.params = { id: "0" };

            await GET_ROLE(mockRequest as Request, mockResponse as Response);
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({ body: mockRoles[0], success: true });
        });
    });
})