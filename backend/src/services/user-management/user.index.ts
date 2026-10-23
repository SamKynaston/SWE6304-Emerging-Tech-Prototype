import userRoutes from "./users/user.routes";
import permissionRoutes from "./permissions/permission.routes";
import { initialiseService } from "../../utils/start.service";
import { seedSampleUserData } from "./users/users.sample";
import { seedSampleRoleData } from "./permissions/permissions.sample";

// 
//  Listener
//
initialiseService("roles", "/v1/roles", permissionRoutes, seedSampleRoleData)
initialiseService("users", "/v1/users", userRoutes, seedSampleUserData)