
// function ProductCard({image, price}){
//     return(

//         <div className = "flex flex-col overflow-hidden rounded bg-neutral-300">
//         <img src = {image} alt = "" className = "aspect-square w-full object-cover"/>
//         <p className = "p-2 text-center font-semibold">{price}</p>
//         </div>

//     );
// }

// export default ProductCard;


import { Bookmark, Maximize2 } from "lucide-react";

function ProductCard({ image, price, isWishlisted, onToggleWishlist, onExpand }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded bg-neutral-300">
      <div className="relative">
        <img src={image} alt="" className="aspect-square w-full object-cover" />

        <div className="absolute inset-0 flex items-center justify-center gap-4 bg-neutral-700/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button
            onClick={onToggleWishlist}
            aria-label="Add to wishlist"
            className="cursor-pointer rounded-full bg-white p-2 text-neutral-800 transition-transform hover:scale-110"
          >
            <Bookmark size={20} fill={isWishlisted ? "currentColor" : "none"} />
          </button>

          <button
            onClick={onExpand}
            aria-label="View details"
            className="cursor-pointer rounded-full bg-white p-2 text-neutral-800 transition-transform hover:scale-110"
          >
            <Maximize2 size={20} />
          </button>
        </div>
      </div>

      <p className="p-2 text-center font-semibold">{price}</p>
    </div>
  );
}

export default ProductCard;
