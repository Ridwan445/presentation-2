import express from "express";
import helmet from "helmet";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import UserRoutes from "./routes/user.routes";
import PostRoutes from "./routes/post.routes";
import dotenv from "dotenv";
import CommentRoutes from "./routes/comment.routes";
dotenv.config();

class App {
  public app: express.Application; 
  public port: string | number;
  private prisma: PrismaClient;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.prisma = new PrismaClient();
    this.connectToDb();
    this.middleware();
    this.routes(); 
  }

  private async connectToDb() {
    try {
      await this.prisma.$connect();
      console.log("Connected to database");
    } catch (error) {
      console.log("Failed to connect", error);  
    }
  }

  private middleware() {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json());
  }

  private routes() {
    const userRoutes = new UserRoutes();
    const postRoutes = new PostRoutes()
    const commentRoutes = new CommentRoutes()
    this.app.use("/api", userRoutes.router);
    this.app.use("/api", postRoutes.router);
    this.app.use("/api", commentRoutes.router)
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}

const app = new App();
app.start();
