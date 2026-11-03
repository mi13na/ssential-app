function ProductModal({ product, onClose }) {
  if (!product) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-20 flex items-center justify-center bg-black/60 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md overflow-hidden rounded bg-white"
      >
        <img src={product.image} alt={product.name} className="aspect-square w-full object-cover" />
        <div className="p-4">
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <p className="mt-1 text-lg font-semibold">{product.price}</p>
          <p className="mt-3 text-neutral-700">{product.description}</p>
          <button
            onClick={onClose}
            className="mt-4 cursor-pointer rounded bg-neutral-800 px-4 py-2 text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;