import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export class Password {
  static async getHash(password: string) {
    const salt = randomBytes(16).toString("hex");
    const hashedPassword = ((await scryptAsync(
      password,
      salt,
      64
    )) as Buffer).toString("hex");

    return `${hashedPassword}.${salt}`;
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split(".");
    const suppliedPasswordHash = ((await scryptAsync(
      suppliedPassword,
      salt,
      64
    )) as Buffer).toString("hex");

    return hashedPassword === suppliedPasswordHash;
  }
}
