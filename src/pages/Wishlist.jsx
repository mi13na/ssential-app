// import { useState } from "react";
// import ProductCard from "../ProductCard";
// import ProductModal from "../ProductModal";
// import products from "../products";

// function Wishlist({ wishlist, toggleWishlist }) {
//   const [selected, setSelected] = useState(null);

//   const savedProducts = products.filter((product) => wishlist.includes(product.id));

//   return (
//     <>
//       <h2 className="mx-auto mb-4 max-w-5xl text-2xl font-bold text-white">Wishlist</h2>

//       {savedProducts.length === 0 ? (
//         <p className="mx-auto max-w-5xl text-white">
//           Nothing saved yet. Hover over an item in the Shop and click the bookmark.
//         </p>
//       ) : (
//         <div className="mx-auto grid max-w-5xl grid-cols-4 gap-4">
//           {savedProducts.map((product) => (
//             <ProductCard
//               key={product.id}
//               image={product.image}
//               price={product.price}
//               isWishlisted={true}
//               onToggleWishlist={() => toggleWishlist(product.id)}
//               onExpand={() => setSelected(product)}
//             />
//           ))}
//         </div>
//       )}

//       <ProductModal product={selected} onClose={() => setSelected(null)} />
//     </>
//   );
// }

// export default Wishlist;

import { useState } from "react";
import ProductCard from "../ProductCard";
import ProductModal from "../ProductModal";
import ProductSkeleton from "../ProductSkeleton";

function Wishlist({ products, loading, error, wishlist, toggleWishlist }) {
  const [selected, setSelected] = useState(null);

  const savedProducts = products.filter((product) => wishlist.includes(product.id));

  let content;

  if (loading) {
    content = <ProductSkeleton />;
  } else if (error) {
    content = <p className="mx-auto max-w-5xl text-white">{error}</p>;
  } else if (savedProducts.length === 0) {
    content = (
      <p className="mx-auto max-w-5xl text-white">
        Your wishlist is empty. Hover over an item in the Shop and click the bookmark to save it.
      </p>
    );
  } else {
    content = (
      <div className="mx-auto grid max-w-5xl grid-cols-4 gap-4">
        {savedProducts.map((product) => (
          <ProductCard
            key={product.id}
            image={product.image}
            price={product.price}
            isWishlisted={true}
            onToggleWishlist={() => toggleWishlist(product.id)}
            onExpand={() => setSelected(product)}
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <h2 className="mx-auto mb-4 max-w-5xl text-2xl font-bold text-white">Wishlist</h2>

      {content}

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </>
  );
}

export default Wishlist;