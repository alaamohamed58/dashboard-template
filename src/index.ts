import "dotenv/config";

import App from "./app";
import AuthenticationController from "./resources/authentication/authentication.controller";
import UserController from "./resources/users/user.controller";
import AboutController from "./resources/about-us/about.controller";
import TeamController from "./resources/team/team.controller";
import SocialController from "./resources/social-mdedia/social.controller";

const port = process.env.PORT || 3000;

const app = new App(
  [
    new AuthenticationController(),
    new UserController(),
    new AboutController(),
    new TeamController(),
    new SocialController(),
  ],
  Number(port)
);

app.listen();
