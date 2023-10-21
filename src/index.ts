import "dotenv/config";

import App from "./app";
import AuthenticationController from "./resources/authentication/authentication.controller";
import UserController from "./resources/users/user.controller";

const port = process.env.PORT || 3000;

const app = new App(
  [new AuthenticationController(), new UserController()],
  Number(port)
);

app.listen();
