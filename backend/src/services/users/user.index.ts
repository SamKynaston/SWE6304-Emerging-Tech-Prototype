import routes from "./user.routes";
import { initialiseService } from "../../utils/start.service";

// 
//  Listener
//
initialiseService("users", "/v1/users", routes)
