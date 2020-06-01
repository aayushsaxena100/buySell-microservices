import { CustomError } from "./custom-error";

export class NotAuthenticatedError extends CustomError {
  public statusCode = 401;

  constructor() {
    super("Not Authenticated");

    //Only beacause we are using builtin Error class
    Object.setPrototypeOf(this, NotAuthenticatedError.prototype);
  }

  public serializeErrors() {
    return [{ message: "Not Authenticated" }];
  }
}
