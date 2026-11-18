import { formatProductPrice } from "./productUtils";
import { usePriceHistory } from "./hooks/usePriceHistory";

function PriceHistoryChart({ history, currency }) {
  const width = 320;
  const height = 128;
  const padding = 12;
  const prices = history.map((entry) => entry.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;
  const coordinates = history.map((entry, index) => ({
    x:
      history.length === 1
        ? width / 2
        : padding + (index * (width - padding * 2)) / (history.length - 1),
    y:
      height -
      padding -
      ((entry.price - minPrice) / priceRange) * (height - padding * 2),
  }));
  const points = coordinates.map(({ x, y }) => `${x},${y}`).join(" ");
  const formatDate = (date) =>
    date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <section className="mt-4">
      <h3 className="font-semibold">Price history</h3>
      <div className="mt-2 rounded bg-neutral-100 p-3">
        <div className="mb-1 flex justify-between text-xs text-neutral-600">
          <span>Low {formatProductPrice({ price: minPrice, currency })}</span>
          <span>High {formatProductPrice({ price: maxPrice, currency })}</span>
        </div>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label="Product price history chart"
          className="h-32 w-full text-neutral-800"
        >
          <polyline
            points={points}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {coordinates.map(({ x, y }, index) => (
            <circle
              key={`${history[index].date.getTime()}-${index}`}
              cx={x}
              cy={y}
              r="2.5"
              fill="currentColor"
            />
          ))}
        </svg>
        <div className="mt-1 flex justify-between text-xs text-neutral-600">
          <span>{formatDate(history[0].date)}</span>
          <span>{formatDate(history[history.length - 1].date)}</span>
        </div>
      </div>
    </section>
  );
}

function ProductModal({ product, onClose }) {
  const { data: priceHistory, loading: historyLoading, error: historyError } =
    usePriceHistory(product?.id);

  if (!product) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-20 flex items-center justify-center bg-black/60 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded bg-white"
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="aspect-square w-full bg-white object-contain"
          />
        ) : (
          <div className="flex aspect-square items-center justify-center bg-white text-neutral-600">
            Image unavailable
          </div>
        )}
        <div className="p-4">
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <p className="mt-1 text-lg font-semibold">{formatProductPrice(product)}</p>
          {product.description && <p className="mt-3 text-neutral-700">{product.description}</p>}
          {product.product_url && (
            <a
              href={product.product_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm text-blue-600 underline"
            >
              View on SSENSE
            </a>
          )}
          {historyLoading ? (
            <p className="mt-4 text-sm text-neutral-600">Loading price history...</p>
          ) : historyError ? (
            <p role="alert" className="mt-4 text-sm text-red-700">
              Could not load price history: {historyError.message}
            </p>
          ) : priceHistory.length > 0 ? (
            <PriceHistoryChart history={priceHistory} currency={product.currency} />
          ) : (
            <p className="mt-4 text-sm text-neutral-600">No price history available yet.</p>
          )}
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