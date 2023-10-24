import "dotenv/config";

import App from "./app";
import AuthenticationController from "./resources/authentication/authentication.controller";
import UserController from "./resources/users/user.controller";
import AboutController from "./resources/about-us/about.controller";

const port = process.env.PORT || 3000;

const app = new App(
  [new AuthenticationController(), new UserController(), new AboutController()],
  Number(port)
);

app.listen();
