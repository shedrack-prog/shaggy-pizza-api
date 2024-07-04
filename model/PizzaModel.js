import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;

const PizzaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: ['Please provide image for the product'],
    },
    description: {
      type: String,
      required: true,
    },
    sauces: [],

    cheeses: [],
    veggies: [],
    price: {
      type: Number,
      required: true,
    },
    totalInStock: {
      type: Number,
      default: 25,
    },
  },
  {
    timestamps: true,
  }
);

const Pizza = mongoose.models.Pizza || mongoose.model('Pizza', PizzaSchema);

export default Pizza;
