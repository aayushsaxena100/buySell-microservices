import { CustomError } from "./custom-error";

export class InternalServerError extends CustomError {
  reason = "Internal server error";
  statusCode = 500;
  constructor() {
    super("Internal server error");

    //Only beacause we are using builtin Error class
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
