import Stripe from 'stripe';

export const stripe = Stripe(
  'sk_test_51Ol3AFC1Fucuq0dJPHd6o3w5NWVJeBgaKTkFhuTQ1NNe2U1eTDQE18TfqJEqD8YTfkqOzHsqbflz9pihElNpFiOJ00Kqv8Cuda',
  {
    apiVersion: '2023-10-16',
  }
);
