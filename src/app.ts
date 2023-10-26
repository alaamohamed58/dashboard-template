import path from "path";

import express, { Application } from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import Controller from "./utils/interfaces/controller.interface";
import errorMiddleware from "./middleware/error.middleware";
import bodyParser from "body-parser";

class App {
  public express: Application;
  public port: number;
  constructor(controllers: Controller[], port: number) {
    this.express = express();
    this.port = port;

    //initialize methods
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeDatabase();

    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    this.express.use(express.json());
    this.express.use(cors());
    this.express.use(helmet());

    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(express.static("public"));
    this.express.use(cookieParser());
    this.express.use(express.static(path.join(__dirname, "public")));
  }

  private initializeControllers(controllers: Controller[]): void {
    controllers.forEach((controller: Controller) => {
      this.express.use("/api/v1", controller.router);
    });
  }

  private initializeErrorHandling(): void {
    this.express.use(errorMiddleware);
  }

  private initializeDatabase(): void {
    mongoose
      .connect(String(process.env.MONGO_LOCAL))
      .then(() => console.log("Connected To Database"))
      .catch((err) => console.log(err));
  }

  public listen(): void {
    this.express.listen(this.port, () =>
      console.log(`App is  on port ${this.port}`)
    );
  }
}

export default App;
