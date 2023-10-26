import "dotenv/config";

import App from "./app";
import AuthenticationController from "./resources/authentication/authentication.controller";
import UserController from "./resources/users/user.controller";
import AboutController from "./resources/about-us/about.controller";
import TeamController from "./resources/team/team.controller";
import SocialController from "./resources/social-media/social.controller";
import FactController from "./resources/facts/facts.controller";
import LandingController from "./resources/landing/landing.controller";

const port = process.env.PORT || 3000;

const app = new App(
  [
    new AuthenticationController(),
    new UserController(),
    new AboutController(),
    new TeamController(),
    new SocialController(),
    new FactController(),
    new LandingController(),
  ],
  Number(port)
);

app.listen();
