import { useRef, useState } from "react";
import { Layers, ShoppingCart, X } from "lucide-react";
import { formatProductPrice } from "./productUtils";

const SIZE = 110; /* original width of each image, in pixels */
const MIN_SCALE = 0.5; /* NEW: smallest allowed size (half of original) */
const MAX_SCALE = 4; /* NEW: biggest allowed size (4x original) */

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/* Moves one item to the front (or back) and renumbers every item's layer 1, 2, 3... */
function reorder(list, id, toFront) {
  const target = list.find((item) => item.product.id === id);
  const others = list
    .filter((item) => item.product.id !== id)
    .sort((a, b) => a.z - b.z);
  const ordered = toFront ? [...others, target] : [target, ...others];
  return list.map((item) => ({ ...item, z: ordered.indexOf(item) + 1 }));
}

function Collage() {
  const [items, setItems] = useState([]); /* each item: { product, x, y, scale } */
  const [selectedId, setSelectedId] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const boardRef = useRef(null);
  const dragRef = useRef(null);
  const resizeRef = useRef(null); /* NEW: remembers a resize in progress */

  const total = items.reduce(
    (sum, item) =>
      sum + (Number(item.product.displayed_price ?? item.product.price) || 0),
    0
  );
  const totalText = formatProductPrice({
    price: total,
    currency: items[0]?.product.currency,
  });

  /* Called when a product from the grid is dropped on the white area */
  function handleDrop(e) {
    e.preventDefault();
    const data = e.dataTransfer.getData("application/json");
    if (!data) return;

    const product = JSON.parse(data);
    if (items.some((item) => item.product.id === product.id)) return; /* already added */

    const rect = boardRef.current.getBoundingClientRect();
    const x = clamp(e.clientX - rect.left - SIZE / 2, 0, rect.width - SIZE);
    const y = clamp(e.clientY - rect.top - SIZE / 2, 0, rect.height - SIZE);

    const z = Math.max(0, ...items.map((item) => item.z)) + 1; /* on top of everything */
    setItems([...items, { product, x, y, scale: 1, z }]);
    setSelectedId(product.id);
  }

  function removeItem(id) {
    setItems(items.filter((item) => item.product.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  /* Moving an image that is already in the collage */
  function startMove(e, item) {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    setSelectedId(item.product.id);
    setItems((current) => reorder(current, item.product.id, true));
    dragRef.current = {
      id: item.product.id,
      startX: e.clientX,
      startY: e.clientY,
      itemX: item.x,
      itemY: item.y,
      size: SIZE * item.scale, /* NEW: current width, so it stays inside the board */
    };
  }

  function move(e) {
    const drag = dragRef.current;
    if (!drag) return;
    const rect = boardRef.current.getBoundingClientRect();
    const x = clamp(drag.itemX + e.clientX - drag.startX, 0, Math.max(0, rect.width - drag.size));
    const y = clamp(drag.itemY + e.clientY - drag.startY, 0, Math.max(0, rect.height - drag.size));
    setItems((current) =>
      current.map((item) =>
        item.product.id === drag.id ? { ...item, x, y } : item
      )
    );
  }

  function stopMove() {
    dragRef.current = null;
  }

  function sendToBack(id) {
    setItems((current) => reorder(current, id, false));
  }

  /* NEW: resizing with the blue square in the corner */
  function startResize(e, item) {
    e.stopPropagation(); /* so it doesn't also start moving the image */
    e.currentTarget.setPointerCapture(e.pointerId);
    resizeRef.current = {
      id: item.product.id,
      startX: e.clientX,
      startScale: item.scale,
    };
  }

  function resize(e) {
    const r = resizeRef.current;
    if (!r) return;
    e.stopPropagation();
    const rect = boardRef.current.getBoundingClientRect();
    const maxScale = Math.min(MAX_SCALE, rect.width / SIZE); /* never wider than the white area */
    const scale = clamp(r.startScale + (e.clientX - r.startX) / SIZE, MIN_SCALE, maxScale);
    setItems((current) =>
      current.map((item) =>
        item.product.id === r.id ? { ...item, scale } : item
      )
    );
  }

  function stopResize(e) {
    e.stopPropagation();
    resizeRef.current = null;
  }

  return (
    <div
      ref={boardRef}
      className="absolute inset-0 overflow-hidden"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onPointerDown={() => setSelectedId(null)}
    >

      {/* Filter that makes near-pure-white pixels transparent */}
      <svg width="0" height="0" className="absolute">
        <filter id="remove-white" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    -10 -10 -10 30 -0.5"
          />
        </filter>
      </svg>

      {items.length === 0 && (
        <p className="pointer-events-none p-6 text-center text-neutral-400">
          Drag clothing here to build your collage
        </p>
      )}

      {/* The images in the collage */}
      {items.map((item) => {
        const selected = item.product.id === selectedId;
        return (
          <div
            key={item.product.id}
            onPointerDown={(e) => startMove(e, item)}
            onPointerMove={move}
            onPointerUp={stopMove}
            className={`absolute cursor-grab touch-none ${
                selected ? "ring-2 ring-blue-500" : ""
                }`}
            style={{
              left: item.x,
              top: item.y,
              width: SIZE * item.scale, /* NEW: width now depends on scale */
              zIndex: item.z,
            }}
          >
            <img
              src={item.product.image}
              alt={item.product.name}
              draggable={false}
              className="block w-full"
              style={{ filter: "url(#remove-white)" }}
            />
                       {selected && (
              <>
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => sendToBack(item.product.id)}
                  aria-label="Send to back"
                  className="absolute left-1 top-1 cursor-pointer rounded-full bg-neutral-800 p-1 text-white"
                >
                  <Layers size={14} />
                </button>

                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => removeItem(item.product.id)}
                  aria-label="Remove from collage"
                  className="absolute right-1 top-1 cursor-pointer rounded-full bg-red-600 p-1 text-white"
                >
                  <X size={14} />
                </button>

                {/* NEW: drag this corner square to resize */}
                <div
                  onPointerDown={(e) => startResize(e, item)}
                  onPointerMove={resize}
                  onPointerUp={stopResize}
                  aria-label="Resize"
                  className="absolute bottom-0 right-0 h-4 w-4 cursor-nwse-resize touch-none bg-blue-500"
                ></div>
              </>
            )}

          </div>
        );
      })}

      {/* The cart popup */}
      {cartOpen && (
        <div
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute bottom-20 left-4 right-4 z-30 max-h-[60%] overflow-y-auto rounded bg-white p-4 shadow-xl ring-1 ring-neutral-300"
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-bold">Cart ({items.length})</h3>
            <button
              onClick={() => setCartOpen(false)}
              aria-label="Close cart"
              className="cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {items.length === 0 ? (
            <p className="text-sm text-neutral-600">Your cart is empty.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {items.map(({ product }) => (
                <li key={product.id} className="flex items-center gap-3">
                  <img
                    src={product.image}
                    alt=""
                    className="h-14 w-14 shrink-0 bg-white object-contain"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{product.name}</p>
                    <p className="text-sm">{formatProductPrice(product)}</p>
                    {product.product_url && (
                      <a
                        href={product.product_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 underline"
                      >
                        View on SSENSE
                      </a>
                    )}
                  </div>
                  <button
                    onClick={() => removeItem(product.id)}
                    aria-label="Remove from cart"
                    className="cursor-pointer text-neutral-500 hover:text-red-600"
                  >
                    <X size={18} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <p className="mt-4 border-t pt-3 text-right font-bold">Total: {totalText}</p>
        </div>
      )}

      {/* The cart bubble in the bottom left */}
      <button
        onClick={() => setCartOpen(!cartOpen)}
        className="absolute bottom-4 left-4 z-30 flex cursor-pointer items-center gap-2 rounded-full bg-neutral-800 px-4 py-3 font-semibold text-white shadow-lg"
      >
        <ShoppingCart size={20} />
        {totalText}
      </button>
    </div>
  );
}

export default Collage;