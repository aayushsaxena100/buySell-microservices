import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
  reason = "DATABASE CONNECTION ERROR";
  statusCode = 500;
  constructor() {
    super("Error connecting db");

    //Only beacause we are using builtin Error class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
