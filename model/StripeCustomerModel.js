import mongoose from 'mongoose';

const StripeCustomerSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'User Id is required.'],
      unique: true,
    },
    stripeCustomerId: {
      type: String,
      required: [true, 'Stripe Customer Id is required.'],
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const StripeCustomer =
  mongoose.models.StripeCustomer ||
  mongoose.model('StripeCustomer', StripeCustomerSchema);
export default StripeCustomer;
