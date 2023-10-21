import UserInterface from "../../resources/users/user.interface";

interface Token {
  user: UserInterface;
  expiresIn: number;
}

export default Token;
