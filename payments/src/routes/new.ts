import express, { Request, Response } from "express";
import { body } from "express-validator";
import { 
    authenticateUser,
    validateRequest, 
    BadRequestError, 
    NotFoundError, 
    NotAuthorizedError,
    OrderStatus
} from "@bechna-khareedna/common";
import { Order } from "../models/order";
import { stripe } from "../stripe"
import { Payment } from "../models/payments";

const router = express.Router();

router.post('/api/payments',
 authenticateUser,
 [
    body('token')
    .not().isEmpty(),
    body('orderId')
    .not().isEmpty()
 ],
 validateRequest,
 async (req: Request, res: Response)=> {
    const { token, orderId} = req.body;

    const order = await Order.findById(orderId);

    if(!order){
        throw new NotFoundError();
    }

    if(order.userId !== req.currentUser?.id){
        throw new NotAuthorizedError();
    }

    if(order.status == OrderStatus.Cancelled){
        throw new BadRequestError('Cannot pay for cancelled order');
    }

    const charge = await stripe.charges.create({
        currency: 'INR',
        amount: order.price * 100,
        source: token
    });

    const payment = Payment.build({
        orderId: orderId,
        stripeId: charge.id
    });
    await payment.save();
    res.status(201).send({success:true});
 });

 export { router as CreateChargeRouter };