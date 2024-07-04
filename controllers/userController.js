import Order from '../model/OrderModel.js';
import Pizza from '../model/PizzaModel.js';
import User from '../model/UserModel.js';

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.userId }).select(
      '-password'
    );

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(401).json({ message: 'Unauthenticated' });
  }
};

const getUserOrders = async (req, res) => {
  const { userId } = req.user;
  if (!userId) {
    return res.status(401).json({ message: 'Not logged in' });
  }
  try {
    const userOrders = await Order.find({ user: userId })
      .populate({
        path: 'products.product',
        model: Pizza,
        select: 'name image price description',
      })
      .sort({ createdAt: -1 });
    if (!userOrders) {
      return res
        .status(404)
        .json({ message: 'You have not placed any orders yet.' });
    }
    const newOrders = userOrders.map((order) => {
      return {
        id: order?._id,
        productName: order?.products.map((product) => {
          return product.product.name;
        }),
        productImage: order?.products.map((product) => {
          return product.product.image;
        }),
        description: order?.products.map((product) => {
          return product.product.description;
        }),
        status: order?.status,
        createdAt: order?.createdAt,
        updatedAt: order?.updatedAt,
        paid: order?.isPaid,
        address: order?.shippingAddress.address.line1,
        totalPaid: order?.total,
        quantity: order?.quantity,
      };
    });
    return res.status(200).json(newOrders);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export { getCurrentUser, getUserOrders };
