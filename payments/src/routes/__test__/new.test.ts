import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order } from "../../models/order";
import { OrderStatus } from "@bechna-khareedna/common";

it('throws 404 error when purchasing an order that does not exist', async ()=>{
    await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
        token: "asdasd",
        orderId: mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it('throws 401 error when purchasing an order that does not belong to the user', async ()=>{
    
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId: mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        version: 0,
        price: 20
    });
    await order.save();

    await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
        token: "asdasd",
        orderId: order.id,
    })
    .expect(401);
});

it('throws 400 error when purchasing a cancelled order', async ()=>{
    const userId = mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId,
        status: OrderStatus.Cancelled,
        version: 0,
        price: 20
    });
    await order.save();
    
    await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
        token: "asdasd",
        orderId: order.id,
    })
    .expect(400);
});