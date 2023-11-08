import "dotenv/config";

import App from "./app";
import AuthenticationController from "./resources/authentication/authentication.controller";
import UserController from "./resources/users/user.controller";
import AboutController from "./resources/about-us/about.controller";
import ServiceController from "./resources/services/services.controller";
import MessageController from "./resources/messages/message.controller";
import FactController from "./resources/facts/facts.controller";

const port = process.env.PORT || 3000;

const app = new App(
  [
    new AuthenticationController(),
    new UserController(),
    new AboutController(),
    new ServiceController(),
    new MessageController(),
    new FactController(),
  ],
  Number(port)
);

app.listen();
