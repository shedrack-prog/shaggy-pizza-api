import Pizza from '../model/PizzaModel.js';
import User from '../model/UserModel.js';
import StripeCustomer from '../model/StripeCustomerModel.js';

import { stripe } from '../utils/stripe.js';

const checkoutController = async (req, res) => {
  const { pizzaId, userId, qty, size } = req.body;
  try {
    if (!pizzaId) {
      return res.status(200).json({
        message: 'Pizza id not found',
      });
    }
    const pizza = await Pizza.findOne({ _id: pizzaId });
    if (!pizza) {
      return res.status(200).json({
        message: `No pizza found with id: ${pizzaId}`,
      });
    }
    if (pizza.totalInStock < qty) {
      return res
        .status(400)
        .json({ message: 'Pizzas in stock is less than quantity specified' });
    }

    const user = await User.findOne({ _id: userId }).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Unauthenticated' });
    }

    const line_items = [
      {
        price_data: {
          currency: 'USD',
          product_data: {
            name: pizza.name,
            images: [pizza.image],
            description: pizza.description,
            metadata: {
              pizzaId: pizza._id,
            },
          },

          unit_amount: Math.round(pizza.price * 100),
        },
        quantity: qty,
      },
    ];

    let stripeCustomer = await StripeCustomer.findOne({
      userId,
    });
    if (!stripeCustomer) {
      const customer = await stripe.customers.create({
        email: user.email,
      });

      stripeCustomer = await StripeCustomer.create({
        userId,
        stripeCustomerId: customer.id,
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomer.stripeCustomerId,
      mode: 'payment',
      shipping_address_collection: {
        allowed_countries: ['US', 'NG', 'AE', 'AC'],
      },
      phone_number_collection: {
        enabled: true,
      },
      line_items,
      success_url: `${process.env.FRONTEND_URL}/home/success`,
      cancel_url: `${process.env.FRONTEND_URL}/pizzas/${pizzaId}?cancel=1`,
      metadata: {
        pizzaId,
        userId,
        qty,
        size,
        // cheeses: JSON.stringify(cheeses),
        // veggies: JSON.stringify(veggies),
        // sauces: JSON.stringify(sauces),
      },
    });
    return res.status(200).json({ url: session.url });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { checkoutController };
