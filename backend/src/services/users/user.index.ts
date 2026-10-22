import routes from "./user.routes";
import { initialiseService } from "../../utils/start.service";

initialiseService("users", "/v1/users", routes)