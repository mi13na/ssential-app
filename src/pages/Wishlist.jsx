import { useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../ProductCard";
import ProductModal from "../ProductModal";
import ProductSkeleton from "../ProductSkeleton";
import { useAuth } from "../auth/useAuth";
import { useFirestoreCollection } from "../hooks/useFirestoreCollection";
import { mapFirestoreProduct } from "../productUtils";

function Wishlist({
  wishlistEntries,
  wishlistLoading,
  wishlistReadError,
  wishlistActionError,
  toggleWishlist,
}) {
  const [selected, setSelected] = useState(null);
  const { user, loading: authLoading, isConfigured } = useAuth();
  const {
    documents,
    loading: productsLoading,
    error: productsError,
  } = useFirestoreCollection("products", Boolean(user));
  const products = documents.map(mapFirestoreProduct);
  console.log(products[0]);
  const loading =
    authLoading || (Boolean(user) && (wishlistLoading || productsLoading));
  const savedProducts = wishlistEntries
    .map((entry) => {
      const product = products.find((item) => item.id === entry.id);
      return product ? { ...product, wishlistEntry: entry } : null;
    })
    .filter(Boolean);

  return (
    <>
      <h2 className="mx-auto mb-4 max-w-5xl text-2xl font-bold text-white">Wishlist</h2>

      {!isConfigured ? (
        <p className="mx-auto max-w-5xl text-white">
          Configure Firebase to load your wishlist.
        </p>
      ) : loading ? (
        <ProductSkeleton />
      ) : !user ? (
        <p className="mx-auto max-w-5xl text-white">
          <Link to="/login" className="underline">Sign in with Google</Link> to view your wishlist.
        </p>
      ) : wishlistReadError ? (
        <p role="alert" className="mx-auto max-w-5xl text-red-100">
          Could not load wishlist: {wishlistReadError}
        </p>
      ) : productsError ? (
        <p role="alert" className="mx-auto max-w-5xl text-red-100">
          Could not load products: {productsError.message}
        </p>
      ) : (
        <>
          {wishlistActionError && (
            <p role="alert" className="mx-auto mb-4 max-w-5xl text-red-100">
              Wishlist update failed: {wishlistActionError}
            </p>
          )}
          {savedProducts.length === 0 ? (
            <p className="mx-auto max-w-5xl text-white">
              Nothing saved yet. Hover over an item in the Shop and click the bookmark.
            </p>
          ) : (
            <div className="mx-auto grid max-w-5xl grid-cols-4 gap-4">
              {savedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted
                  onToggleWishlist={() => toggleWishlist(product)}
                  onExpand={() => setSelected(product)}
                />
              ))}
            </div>
          )}
        </>
      )}

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </>
  );
}

export default Wishlist;
