import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
    customerId: {
      type: String,
    },

    products: [
      {
        product: {
          type: ObjectId,
          ref: 'Pizza',
        },
      },
    ],
    size: {
      type: String,
    },

    chesses: [],
    veggies: [],
    sauces: [],
    subtotal: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0,
    },

    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },

    payment_status: {
      type: String,
    },

    status: {
      type: String,
      enum: [
        'Not Processed',
        'In the Kitchen',
        'Dispatched',
        'Cancelled',
        'Delivered',
      ],
      default: 'Not Processed',
    },
    quantity: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      type: Object,
      required: true,
    },
    paidAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

export default Order;
