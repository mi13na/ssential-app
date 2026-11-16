// function Inventory() {
//   return (
//     <div>
//       <h1 className="mb-4 text-3xl font-bold text-white">Inventory</h1>
//       <p className="text-white">This is the inventory page.</p>
//     </div>
//   );
// }

// export default Inventory;

import ProductSkeleton from "../ProductSkeleton";

function Inventory({ products, loading, error, purchasedIds }) {
  const purchasedProducts = products.filter((product) =>
    purchasedIds.includes(product.id)
  );

  let content;

  if (loading) {
    content = <ProductSkeleton />;
  } else if (error) {
    content = <p className="mx-auto max-w-5xl text-white">{error}</p>;
  } else if (purchasedProducts.length === 0) {
    content = (
      <p className="mx-auto max-w-5xl text-white">
        You haven't purchased anything yet. Items you buy will show up here.
      </p>
    );
  } else {
    content = (
      <div className="mx-auto grid max-w-5xl grid-cols-4 gap-4">
        {purchasedProducts.map((product) => (
          <div key={product.id} className="overflow-hidden rounded bg-neutral-300">
            <img src={product.image} alt="" className="aspect-square w-full object-cover" />
            <p className="p-2 text-center font-semibold">{product.name}</p>
            <p className="pb-2 text-center">{product.price}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <h2 className="mx-auto mb-4 max-w-5xl text-2xl font-bold text-white">Inventory</h2>

      {content}
    </>
  );
}

export default Inventory;