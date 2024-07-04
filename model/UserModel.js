import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Please enter a name'],
    },
    email: {
      type: String,
      trim: true,
      required: [true, 'Please enter a email address'],
    },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    image: {
      type: String,
      default:
        'https://res.cloudinary.com/dmhcnhtng/image/upload/v1664642478/992490_b0iqzq.png',
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
