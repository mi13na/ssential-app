export function mapFirestoreProduct(product) {
  const productId = product.product_id ?? product.id;

  return {
    ...product,
    id: productId == null ? "" : String(productId),
    image: product.image_url ?? product.image,
    price: product.displayed_price ?? product.price,
    currency: product.currency || "USD",
  };
}

export function formatProductPrice(product) {
  const amount = Number(product.displayed_price ?? product.price);
  if (!Number.isFinite(amount)) return "Price unavailable";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: product.currency || "USD",
  }).format(amount);
}
