export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const limit = query.limit ? parseInt(query.limit as string) : 10;

  let products = getProducts();

  if (limit) {
    products = products.slice(0, limit);
  }
  return products
})
