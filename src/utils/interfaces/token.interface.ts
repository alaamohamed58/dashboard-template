import User from "resources/users/users.interface";

interface Token {
  user: User;
  expiresIn: number;
}

export default Token;
