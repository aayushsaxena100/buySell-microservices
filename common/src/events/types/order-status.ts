export enum OrderStatus {
  //Order created but has not been reserved
  Created = "created",

  //Order has either been cancelled or has already been reserved
  //or the order is expired
  Cancelled = "cancelled",

  //Order has been reserved and awaiting payment
  AwaitingPayment = "awaitingPayment",

  //Order has been completed along with the payment
  Complete = "complete",
}
