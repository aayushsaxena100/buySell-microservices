import { CustomError } from "./custom-error";

export class NotAuthorizedError extends CustomError {
  public statusCode = 401;

  constructor() {
    super("Not Authorized");

    //Only beacause we are using builtin Error class
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  public serializeErrors() {
    return [{ message: "Not Authorized" }];
  }
}
