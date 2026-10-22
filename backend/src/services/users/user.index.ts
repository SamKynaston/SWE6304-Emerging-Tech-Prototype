import routes from "./user.routes";
import { initialiseService } from "../../utils/start.service";
import { seedSampleData } from "./users.sample";

// 
//  Listener
//
initialiseService("users", "/v1/users", routes, seedSampleData)