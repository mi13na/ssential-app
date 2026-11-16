// import ProductCard from "../ProductCard";

// const products = [
//   // placeholder images from picsum.photos
//   { id: 1, image: "https://img.ssensemedia.com/image/upload/b_white,c_lpad,g_south,ar_2:3/f_auto,c_limit,w_480,q_85/262268M192003_1.jpg", price: "$10.00" },
//   { id: 2, image: "https://img.ssensemedia.com/image/upload/b_white,c_lpad,g_south,ar_2:3/f_auto,c_limit,w_480,q_85/262236F093000_1.jpg", price: "$10.00" },
//   { id: 3, image: "https://img.ssensemedia.com/image/upload/b_white,c_lpad,g_south,ar_2:3/f_auto,c_limit,w_384,q_85/261129F069027_1.jpg", price: "$10.00" },
//   { id: 4, image: "https://img.ssensemedia.com/image/upload/b_white,c_lpad,g_south,ar_2:3/f_auto,c_limit,w_480,q_85/262236F110010_1.jpg", price: "$10.00" },
//   { id: 5, image: "https://img.ssensemedia.com/image/upload/b_white,c_lpad,g_south,ar_2:3/f_auto,c_limit,w_384,q_85/262236F054013_1.jpg", price: "$10.00" },
//   { id: 6, image: "https://img.ssensemedia.com/image/upload/b_white,c_lpad,g_south,ar_2:3/f_auto,c_limit,w_384,q_85/262236F054007_1.jpg", price: "$10.00" },
//   { id: 7, image: "https://img.ssensemedia.com/image/upload/b_white,c_lpad,g_south,ar_2:3/f_auto,c_limit,w_480,q_85/262600F062001_1.jpg", price: "$10.00" },
//   { id: 8, image: "https://img.ssensemedia.com/image/upload/b_white,c_lpad,g_south,ar_2:3/f_auto,c_limit,w_480,q_85/261187F060001_1.jpg", price: "$10.00" },
//   { id: 9, image: "https://img.ssensemedia.com/image/upload/b_white,c_lpad,g_south,ar_2:3/f_auto,c_limit,w_384,q_85/261314F109021_1.jpg", price: "$10.00" },
//   { id: 10, image: "https://img.ssensemedia.com/image/upload/b_white,c_lpad,g_south,ar_2:3/f_auto,c_limit,w_384,q_85/262581F100004_1.jpg", price: "$10.00" },
//   { id: 11, image: "https://img.ssensemedia.com/image/upload/b_white,c_lpad,g_south,ar_2:3/f_auto,c_limit,w_480,q_85/262260M201005_1.jpg", price: "$10.00" },
//   { id: 12, image: "https://img.ssensemedia.com/image/upload/b_white,c_lpad,g_south,ar_2:3/f_auto,c_limit,w_480,q_85/262487M202000_1.jpg", price: "$10.00" },
//   { id: 13, image: "https://img.ssensemedia.com/image/upload/b_white,c_lpad,g_south,ar_2:3/f_auto,c_limit,w_384,q_85/262154F110006_1.jpg", price: "$10.00" },
//   { id: 14, image: "https://img.ssensemedia.com/image/upload/b_white,c_lpad,g_south,ar_2:3/f_auto,c_limit,w_384,q_85/262236F052002_1.jpg", price: "$10.00" },
//   { id: 15, image: "https://img.ssensemedia.com/image/upload/b_white,c_lpad,g_south,ar_2:3/f_auto,c_limit,w_384,q_85/262236F110010_1.jpg", price: "$10.00" },
//   { id: 16, image: "https://img.ssensemedia.com/image/upload/b_white,c_lpad,g_south,ar_2:3/f_auto,c_limit,w_384,q_85/262236F059000_1.jpg", price: "$10.00" },
// ];

// function Shop() {
//   return (
//     <>
//       <input
//         type="text"
//         placeholder="Search..."
//         className="mb-4 h-10 w-full rounded bg-neutral-400 px-3 placeholder-neutral-600 outline-none"
//       />

//       <div className="mx-auto grid max-w-5xl grid-cols-4 gap-4">
//         {products.map((p) => (
//           <ProductCard key={p.id} image={p.image} price={p.price} />
//         ))}
//       </div>
//     </>
//   );
// }

// export default Shop;

// import { useState } from "react";
// import ProductCard from "../ProductCard";
// import ProductModal from "../ProductModal";
// import products from "../products";

// function Shop({ wishlist, toggleWishlist }) {
//   const [selected, setSelected] = useState(null);

//   return (
//     <>
//       <input
//         type="text"
//         placeholder="Search..."
//         className="mx-auto mb-4 block w-full max-w-5xl rounded bg-white p-2"
//       />

//       <div className="mx-auto grid max-w-5xl grid-cols-4 gap-4">
//         {products.map((product) => (
//           <ProductCard
//             key={product.id}
//             image={product.image}
//             price={product.price}
//             isWishlisted={wishlist.includes(product.id)}
//             onToggleWishlist={() => toggleWishlist(product.id)}
//             onExpand={() => setSelected(product)}
//           />
//         ))}
//       </div>

//       <ProductModal product={selected} onClose={() => setSelected(null)} />
//     </>
//   );
// }

// export default Shop;


import { useState } from "react";
import ProductCard from "../ProductCard";
import ProductModal from "../ProductModal";
import ProductSkeleton from "../ProductSkeleton";

function Shop({ products, loading, error, wishlist, toggleWishlist }) {
  const [selected, setSelected] = useState(null);

  let content;

  if (loading) {
    content = <ProductSkeleton />;
  } else if (error) {
    content = <p className="mx-auto max-w-5xl text-white">{error}</p>;
  } else if (products.length === 0) {
    content = <p className="mx-auto max-w-5xl text-white">No products yet.</p>;
  } else {
    content = (
      <div className="mx-auto grid max-w-5xl grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            image={product.image}
            price={product.price}
            isWishlisted={wishlist.includes(product.id)}
            onToggleWishlist={() => toggleWishlist(product.id)}
            onExpand={() => setSelected(product)}
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <input
        type="text"
        placeholder="Search..."
        className="mx-auto mb-4 block w-full max-w-5xl rounded bg-white p-2"
      />

      {content}

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </>
  );
}

export default Shop;