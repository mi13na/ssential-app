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
import { Link } from "react-router-dom";
import ProductCard from "../ProductCard";
import ProductModal from "../ProductModal";
import ProductSkeleton from "../ProductSkeleton";
import { useAuth } from "../auth/useAuth";
import { useFirestoreCollection } from "../hooks/useFirestoreCollection";
import { mapFirestoreProduct } from "../productUtils";

function Shop({
  wishlist,
  wishlistReadError,
  wishlistActionError,
  toggleWishlist,
}) {
  const [selected, setSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, loading: authLoading, isConfigured } = useAuth();
  const {
    documents,
    loading: productsLoading,
    error,
  } = useFirestoreCollection("products", Boolean(user));
  const products = documents.map(mapFirestoreProduct);
  const loading = authLoading || (Boolean(user) && productsLoading);
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredProducts = normalizedQuery
    ? products.filter((product) =>
        [product.name, product.brand, product.product_id, product.id, product.description]
          .some((value) => String(value ?? "").toLowerCase().includes(normalizedQuery)),
      )
    : products;

  return (
    <>
      <input
        type="search"
        aria-label="Search products"
        placeholder="Search products by name or brand..."
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        className="mx-auto mb-4 block w-full max-w-5xl rounded bg-white p-2"
      />

      {wishlistReadError && (
        <p role="alert" className="mx-auto mb-4 max-w-5xl text-red-100">
          Could not load wishlist: {wishlistReadError}
        </p>
      )}
      {wishlistActionError && (
        <p role="alert" className="mx-auto mb-4 max-w-5xl text-red-100">
          Wishlist update failed: {wishlistActionError}
        </p>
      )}

      {!isConfigured ? (
        <p className="mx-auto max-w-5xl text-white">
          Configure Firebase to load products and prices.
        </p>
      ) : loading ? (
        <ProductSkeleton />
      ) : !user ? (
        <p className="mx-auto max-w-5xl text-white">
          <Link to="/login" className="underline">Sign in with Google</Link> to load products and prices.
        </p>
      ) : error ? (
        <p role="alert" className="mx-auto max-w-5xl text-red-100">
          Could not load products: {error.message}
        </p>
      ) : products.length === 0 ? (
        <p className="mx-auto max-w-5xl text-white">
          No products found in the Firestore products collection.
        </p>
      ) : filteredProducts.length === 0 ? (
        <p role="status" className="mx-auto max-w-5xl text-white">
          No products match "{searchQuery.trim()}".
        </p>
      ) : (
        <div className="mx-auto grid max-w-5xl grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={wishlist.includes(product.id)}
              onToggleWishlist={() => toggleWishlist(product)}
              onExpand={() => setSelected(product)}
            />
          ))}
        </div>
      )}

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </>
  );
}

export default Shop;