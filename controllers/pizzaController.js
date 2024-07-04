import mongoose from 'mongoose';
import Pizza from '../model/PizzaModel.js';
const { ObjectId } = mongoose.Types;

const createPizza = async (req, res) => {
  const { name, description, sauces, cheeses, veggies, price, image } =
    req.body;

  if (
    !name ||
    !description ||
    !cheeses ||
    !cheeses ||
    !veggies ||
    !price ||
    !image
  ) {
    return res
      .status(400)
      .json({ message: 'Please make sure all values are present or valid ' });
  }
  try {
    const newPizza = new Pizza({
      name,
      description,
      sauces: [...sauces],
      cheeses: [...cheeses],
      veggies: [...veggies],
      price,
      image,
    });
    const pizza = await newPizza.save();
    return res.status(201).json({
      message: 'Pizza added successfully',
      pizza,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const getAllPizzas = async (req, res) => {
  try {
    const pizzas = await Pizza.find({});
    if (!pizzas || !pizzas.length) {
      return res.status(404).json({
        message: 'No pizzas found',
      });
    }
    // console.log(req.user);
    return res.status(200).json(pizzas);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const getPizzaById = async (req, res) => {
  const { id } = req.params;
  try {
    const pizza = await Pizza.findOne({ _id: id });
    if (!pizza) {
      return res.status(404).json({
        message: `No pizza found with id: ${id}`,
      });
    }
    res.status(200).json(pizza);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const updatePizzaById = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, image, newSauces, newVeggies, newCheeses } =
    req.body;
  try {
    const pizza = await Pizza.findById(id);
    if (!pizza) {
      return res.status(404).json({
        message: `No pizza found with id: ${id}`,
      });
    }
    pizza.name = name;
    pizza.description = description;
    pizza.price = price;
    pizza.image = image;
    pizza.sauce = [...newSauces];
    pizza.cheese = [...newCheeses];
    pizza.veggies = [...newVeggies];
    await pizza.save();
    res.status(200).json({
      message: 'Pizza updated successfully',
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const deletePizzaById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPizza = await Pizza.findByIdAndDelete(id);
    if (!deletedPizza) {
      return res.status(404).json({
        message: `No pizza found with id: ${id}`,
      });
    }
    res.status(200).json({
      message: 'Pizza deleted successfully',
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export {
  getAllPizzas,
  deletePizzaById,
  getPizzaById,
  updatePizzaById,
  createPizza,
};
