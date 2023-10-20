import "dotenv/config";

import App from "./app";
import UserController from "./resources/users/users.controller";

const port = process.env.PORT || 3000;

const app = new App([new UserController()], Number(port));

app.listen();
