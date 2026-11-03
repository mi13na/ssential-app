
// import ProductCard from "./ProductCard";

// import { useState } from "react";


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

// function App() {

//   const [menuOpen, setMenuOpen] = useState(false);

//   return (

    
    
//     <div className="flex h-screen flex-col">
  
//       <header className="flex h-[75px] items-center justify-between bg-neutral-800 px-6">
//         <button
//           onClick={() => setMenuOpen(!menuOpen)}
//           className="flex h-8 w-8 flex-col justify-between py-1 cursor-pointer"
//           aria-label="Toggle menu"
//         >
//           <span className="h-[3px] w-full rounded bg-white"></span>
//           <span className="h-[3px] w-full rounded bg-white"></span>
//           <span className="h-[3px] w-full rounded bg-white"></span>
//         </button>

//         <div className="h-12 w-12 rounded-full bg-white"></div> {/* avatar */}
//       </header>

//       <div className="flex flex-1 overflow-hidden">
//         <aside className="w-[30%] bg-white">{/* side bar */}</aside>

//         <main className="flex-1 overflow-y-auto bg-neutral-500 p-4">
//           {/* search bar code */}
//           <input
//             type="text"
//             placeholder="Search..."
//             className="mb-4 h-10 w-full rounded bg-neutral-400 px-3 placeholder-neutral-600 outline-none"
//           />

//           <div className="mx-auto grid max-w-5xl grid-cols-4 gap-4">
//             {products.map((p) => (
//               <ProductCard key={p.id} image={p.image} price={p.price} />
//             ))}
//           </div>
//         </main>

//         {/*click outside to close the side bar code:*/}
//         {menuOpen && (
//           <div
//             onClick={() => setMenuOpen(false)}
//             className="fixed inset-0 top-[75px] z-0 bg-black/40"
//           ></div>
//         )}

//         <aside
//           className={`fixed left-0 top-[75px] z-10 h-[calc(100vh-75px)] w-[30%] bg-neutral-800 p-6 text-white transition-transform duration-300 ${
//             menuOpen ? "translate-x-0" : "-translate-x-full"
//           }`}
//         >
//           <p className="mb-7 text-4xl font-semibold">Menu</p>
//           <ul className="space-y-5 text-2xl">
//             <li>Home</li>
//             <li>Shop</li>
//             <li>Inventory</li>
//             <li>Settings</li>
//           </ul>
//         </aside>
//       </div>
//     </div>
//   );
// }

// export default App;


// VERSION 2 - BECAME OUTDATED 11/01/2026

// import { Routes, Route } from "react-router-dom";
// import Layout from "./Layout";
// import Shop from "./pages/Shop";
// import Inventory from "./pages/Inventory";

// function App() {
//   return (
//     <Routes>
//       <Route element={<Layout />}>
//         <Route path="/" element={<Shop />} />
//         <Route path="/inventory" element={<Inventory />} />
//       </Route>
//     </Routes>
//   );
// }

// export default App;

import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Shop from "./pages/Shop";
import Inventory from "./pages/Inventory";
import Wishlist from "./pages/Wishlist";

function App() {
  const [wishlist, setWishlist] = useState([]);

  function toggleWishlist(id) {
    setWishlist((current) =>
      current.includes(id)
        ? current.filter((itemId) => itemId !== id)
        : [...current, id]
    );
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path="/"
          element={<Shop wishlist={wishlist} toggleWishlist={toggleWishlist} />}
        />
        <Route path="/inventory" element={<Inventory />} />
        <Route
          path="/wishlist"
          element={<Wishlist wishlist={wishlist} toggleWishlist={toggleWishlist} />}
        />
      </Route>
    </Routes>
  );
}

export default App;