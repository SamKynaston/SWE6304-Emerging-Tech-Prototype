import Express, { type Router } from "express";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";

export async function initialiseService(basePath: string, routes: Router) : Promise<void> {
    const app: Express.Application = Express();
    
    //
    // Middleware
    //

    // Use the cookieParser middleware in order to ensure cookie-based controllers work
    app.use(cookieParser());
    app.use(
        session({
        secret: "secret",
        resave: false,
        saveUninitialized: false,
        }),
    );

    // Automatically set all requests to json
    app.use(Express.json());
    
    app.use(basePath, routes)

    // If in development, set cors origin so local ips work
    if (process.env.ENVIRONMENT === "DEVELOPMENT") {
        app.use(cors({
            origin: (origin, callback) => {
                if (!origin) return callback(null, true);

                return callback(null, origin);
            },
            credentials: true
        }));
    } else {
        // Otherwise, expect requests from a specified domain
        app.use(cors({
        origin: ["https://bookwebapp.com"],
        credentials: true
        }));
    }
    
    // 
    //  Listener
    //
    const port = Number(process.env.PORT ?? 3000);
    app.listen(port, () => {
        console.log(`Service listening on port ${port}`);
    });
}