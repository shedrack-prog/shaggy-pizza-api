import Sauce from '../model/SauceModel.js';
import Cheese from '../model/CheeseModel.js';
import Veggie from '../model/VeggiesModel.js';
import User from '../model/UserModel.js';
import Order from '../model/OrderModel.js';
import Pizza from '../model/PizzaModel.js';

// Sauce Controller
const createSauce = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({
      message: 'Please enter a name for the sauce',
    });
  }

  try {
    const sauce = await Sauce.findOne({ name });

    if (sauce) {
      return res.status(400).json({ message: 'Sauce name already exist' });
    }

    await new Sauce({ name }).save();

    return res.status(201).json({ message: 'Sauce created successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
};

const getAllSauces = async (req, res) => {
  try {
    const sauces = await Sauce.find();
    return res.status(200).json(sauces);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
};

// Cheese Controller

const createCheese = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({
      message: 'Please enter a name for the cheese',
    });
  }

  try {
    const cheese = await Cheese.findOne({ name });

    if (cheese) {
      return res.status(400).json({ message: 'Cheese name already exist' });
    }
    await new Cheese({ name }).save();

    return res.status(201).json({ message: 'Cheese created successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
};

const getAllCheese = async (req, res) => {
  try {
    const allCheese = await Cheese.find({});
    return res.status(200).json(allCheese);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
// Veggies Controller

const createVeggie = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({
      message: 'Please enter a name for the Vegetable',
    });
  }
  try {
    const veggie = await Veggie.findOne({ name });

    if (veggie) {
      return res.status(400).json({ message: 'Veggie name already exists' });
    }

    await new Veggie({ name }).save();

    return res.status(201).json({ message: 'Veggie created successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
};

const getAllVeggies = async (req, res) => {
  try {
    const allVeggies = await Veggie.find({});
    return res.status(200).json(allVeggies);
  } catch (error) {
    1;
    return res.status(500).json({ message: error });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({ role: 'user' });
    if (!allUsers) {
      return res.status(404).json({ message: 'No users found' });
    }
    return res.status(200).json(allUsers);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const allOrders = await Order.find({})
      .populate({ path: 'user', model: User, select: 'name email image' })
      .populate({
        path: 'products.product',
        model: Pizza,
        select: 'name image price',
      })
      .sort({ createdAt: -1 });
    if (allOrders.length < 1) {
      return res.status(404).json({ message: 'No orders found' });
    }

    let updatedOrders = allOrders.map((order) => {
      return {
        id: order?._id,
        userName: order?.user?.name,
        userEmail: order?.user?.email,
        productName: order?.products.map((product) => {
          return product.product.name;
        }),
        productImage: order?.products.map((product) => {
          return product.product.image;
        }),
        createdAt: order?.createdAt,
        updatedAt: order?.updatedAt,
        paid: order?.isPaid,
        address: order?.shippingAddress.address.line1,
        city: order?.shippingAddress.address.city,
        state: order?.shippingAddress.address.state,
        postalCode: order?.shippingAddress.address.postal_code,
        phone: order?.shippingAddress.address.phone,
        status: order?.status,
        size: order?.size,
      };
    });
    return res.status(200).json(updatedOrders);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
};

const editOrderStatus = async (req, res) => {
  const { status } = req.body;
  const orderId = req.params.orderId;

  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        status: status,
      },
      {
        new: true,
      }
    );

    return res.status(200).json({ message: 'update successful' });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const getTotalRevenue = async (req, res) => {
  try {
    const paidOrders = await Order.find({
      isPaid: true,
    }).populate({
      path: 'products.product',
      model: Pizza,
      select: 'price',
    });

    const totalRevenue = paidOrders.reduce((total, order) => {
      const orderTotal = order.products.reduce((orderSum, item) => {
        return orderSum + item.product.price;
      }, 0);
      return total + orderTotal;
    }, 0);

    res.status(200).json(totalRevenue);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const getTotalSales = async (req, res) => {
  try {
    const totalSales = await Order.countDocuments();
    res.status(200).json(totalSales);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const getTotalPizzas = async (req, res) => {
  try {
    const totalPizzas = await Pizza.countDocuments();
    res.status(200).json(totalPizzas);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const getGraphRevenue = async (req, res) => {
  try {
    const paidOrders = await Order.find({
      isPaid: true,
    }).populate({
      path: 'products.product',
      model: Pizza,
      select: 'price',
    });
    let monthlyRevenue = {};
    for (const order of paidOrders) {
      const month = order.createdAt.getMonth();
      let revenueForOrder = 0;

      for (const item of order.products) {
        revenueForOrder += item.product.price;
      }

      // Adding the revenue for this order to the respective month
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;
    }

    // Converting the grouped data into the format expected by the graph
    const graphData = [
      { name: 'Jan', total: 0 },
      { name: 'Feb', total: 0 },
      { name: 'Mar', total: 0 },
      { name: 'Apr', total: 0 },
      { name: 'May', total: 0 },
      { name: 'Jun', total: 0 },
      { name: 'Jul', total: 0 },
      { name: 'Aug', total: 0 },
      { name: 'Sep', total: 0 },
      { name: 'Oct', total: 0 },
      { name: 'Nov', total: 0 },
      { name: 'Dec', total: 0 },
    ];

    // Filling in the revenue data
    for (const month in monthlyRevenue) {
      graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)];
    }

    return res.status(200).json(graphData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
};

export {
  createSauce,
  getAllSauces,
  getAllCheese,
  getAllVeggies,
  createCheese,
  createVeggie,
  getAllUsers,
  getAllOrders,
  editOrderStatus,
  getTotalRevenue,
  getTotalSales,
  getTotalPizzas,
  getGraphRevenue,
};
