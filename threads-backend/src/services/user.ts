import { createHmac, randomBytes } from "node:crypto";
import { prismaClient } from "../lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = "@@br@k@d@br@";

export interface CreateUserPayload {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}

export interface GetUserTokenPayload {
  email: string;
  password: string;
}

class UserService {
  private static generateHash(salt: string, password: string) {
    if (!salt || !password) {
      throw new Error("Salt and password are required for hashing.");
    }
    const hashedPass = createHmac("sha256", salt)
      .update(password)
      .digest("hex");
    return hashedPass;
  }
  public static createUser(payload: CreateUserPayload) {
    const { firstName, lastName, email, password } = payload;
    const salt = randomBytes(32).toString("hex");
    const hashedPass = UserService.generateHash(salt, password);

    return prismaClient.user.create({
      data: {
        firstName,
        lastName,
        email,
        salt,
        password: hashedPass,
      },
    });
  }

  private static getUserByEmail(email: string) {
    return prismaClient.user.findUnique({ where: { email } });
  }
  public static async getUserToken(payload: GetUserTokenPayload) {
    const { email, password } = payload;
    const user = await UserService.getUserByEmail(email);
    if (!user) throw new Error("user not found");

    // Debugging: Log the user and input password
    console.log("User from DB:", user);
    console.log("Input password:", password);

    const userSalt = user.salt;
    const userHashPassword = UserService.generateHash(userSalt, password);

    if (userHashPassword !== user.password) {
      throw new Error("Incorrect Password");
    }
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);

    return token;
  }
}

export default UserService;
