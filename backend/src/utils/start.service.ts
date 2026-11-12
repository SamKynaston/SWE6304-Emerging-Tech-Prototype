import Express, { type Router } from "express";
import { createServer, Server } from "node:http";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";

export async function initialiseService(basePath: string, routes: Router, configureServer?: (server: Server) => void) : Promise<void> {
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
        origin: ["https://prototype.com"],
        credentials: true
        }));
    }

    app.use(basePath, routes)
    
    // 
    //  Listener
    //
    /*const port = Number(process.env.PORT ?? 3000);
    app.listen(port, () => {
        console.log(`Service listening on port ${port}`);
    });*/

    const server = createServer(app);
    configureServer?.(server);

    const port = Number(process.env.PORT ?? 3000);
    server.listen(port, () => {
        console.log(`Service listening on port ${port}`);
    });
}