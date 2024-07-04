import mongoose from 'mongoose';

const CheeseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Cheese = mongoose.models.Cheese || mongoose.model('Cheese', CheeseSchema);
export default Cheese;
