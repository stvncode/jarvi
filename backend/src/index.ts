import { cors } from "@elysiajs/cors"
import { swagger } from '@elysiajs/swagger'
import { Elysia } from "elysia"
import { env } from "./env"
import { statsRoutes } from "./routes/stats"

const app = new Elysia()
  .use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }))
  .use(swagger({
    documentation: {
      info: {
        title: "Jarvi Stats API",
        version: "1.0.0"
      }
    }
  }))
  .get("/", () => ({ 
    message: "Jarvi Stats API", 
    version: "1.0.0",
    timestamp: new Date().toISOString()
  }))
  .use(statsRoutes)
  .listen(env.PORT);

console.log(
  `🦊 Jarvi Stats API is running at ${app.server?.hostname}:${app.server?.port}`
);

export type ServerApp = typeof app 