import mongoose from 'mongoose';

const VeggiesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Veggie =
  mongoose.models.Veggie || new mongoose.model('Veggie', VeggiesSchema);
export default Veggie;
