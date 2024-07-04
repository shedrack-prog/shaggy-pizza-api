import { Router } from 'express';
import { stripe } from '../utils/stripe.js';
import Order from '../model/OrderModel.js';
import Pizza from '../model/PizzaModel.js';
import User from '../model/UserModel.js';
import StripeCustomer from '../model/StripeCustomerModel.js';
import express from 'express';
import { sendNotificationToAdmin } from '../helpers/mailer.js';

const router = Router();

router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      console.log(err);
      return;
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const paymentIntentSucceeded = event.data.object;
        const userId = paymentIntentSucceeded?.metadata?.userId;
        const pizzaId = paymentIntentSucceeded?.metadata?.pizzaId;
        const qty = paymentIntentSucceeded?.metadata?.qty;
        const size = paymentIntentSucceeded?.metadata?.size;
        // const veggies = paymentIntentSucceeded?.metadata?.veggies;
        // const sauces = paymentIntentSucceeded?.metadata?.sauces;
        // const cheeses = paymentIntentSucceeded?.metadata?.cheeses;
        if (!userId || !pizzaId) {
          return res
            .status(400)
            .json({ message: `Webhook error: Missing Metadata.` });
        }
        try {
          // const user = await User.findOne({ userId });
          const pizza = await Pizza.findOne({ _id: pizzaId });
          pizza.totalInStock = pizza.totalInStock - qty;
          await pizza.save();

          const stripeCustomer = await StripeCustomer.findOne({ userId });
          const newOrder = await new Order({
            user: userId,
            customerId: stripeCustomer.stripeCustomerId,
            products: { product: pizzaId },
            // cheeses: [...cheeses],
            // veggies: [...veggies],
            // sauces: [...sauces],
            total: paymentIntentSucceeded.amount_total,
            subtotal: paymentIntentSucceeded.amount_subtotal,
            shippingAddress: paymentIntentSucceeded.customer_details,
            payment_status: paymentIntentSucceeded.payment_status,
            isPaid: true,
            shippingPrice: paymentIntentSucceeded.shipping_cost || 0,
            quantity: paymentIntentSucceeded?.metadata?.qty,
            size: paymentIntentSucceeded?.metadata?.size,
          }).save();

          if (pizza.totalInStock < 10) {
            sendNotificationToAdmin(pizza.name);
            return;
          }
        } catch (error) {
          console.log(error);
        }

        break;

      // ... handle other event types
      default:
        return res
          .status(200)
          .json({ message: `Webhook error: Unhandled event type` });
    }

    // Return a 200 response to acknowledge receipt of the event
    res.send();
  }
);

export default router;
