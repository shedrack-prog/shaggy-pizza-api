import mongoose from 'mongoose';

const SauceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Sauce = mongoose.models.Sauce || new mongoose.model('Sauce', SauceSchema);
export default Sauce;
