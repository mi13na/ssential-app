// import './App.css'
// import ProductCard from "./ProductCard";

// const products = [

//     // https://picsum.photos/id/10/300 is just a placeholder image taken from online? lol
//   {id: 1, image: "https://picsum.photos/id/10/300", price: "$10.00"},
//   {id: 2, image: "https://picsum.photos/id/10/300", price: "$10.00"},
//   {id: 3, image: "https://picsum.photos/id/10/300", price: "$10.00"},
//   {id: 4, image: "https://picsum.photos/id/10/300", price: "$10.00"},
//   {id: 5, image: "https://picsum.photos/id/10/300", price: "$10.00"},
//   {id: 6, image: "https://picsum.photos/id/10/300", price: "$10.00"},
//   {id: 7, image: "https://picsum.photos/id/10/300", price: "$10.00"},
//   {id: 8, image: "https://picsum.photos/id/10/300", price: "$10.00"},
//   {id: 9, image: "https://picsum.photos/id/10/300", price: "$10.00"},

// ]

// function App(){

//   return(

//     <div>

//     <div className = "square" id = "square1"></div>
//     <div className = "square" id = "square2"></div>


//     <div className = "flex h-screen flex-col">
//       <header className = "h-[75px] bg-neutral-800">{/*menu + avatar */}</header>

//       <div className = "flex flex-1 overflow-hidden">
//         <aside className = "w-[30%]  bg-white">{/* side bar */}</aside>
//         <div className="mb-4 h-8 bg-neutral-400"></div>

//       //</div><main className = "flex-1 overflow-y-auto bg-neutral-500 p-4"></main>

//     </div>


//     <div className = "grid grid-cols-3 gap-4 bg-neutral-500 p-4">
//       {products.map((p) => (
//         <ProductCard key = {p.id} image = {p.image} price = {p.price} />
//       ))}

//     </div>
//     </div>

    


//   );


// }

// export default App;


import ProductCard from "./ProductCard";

import { useState } from "react";


const products = [
  // placeholder images from picsum.photos
  { id: 1, image: "https://picsum.photos/id/10/300", price: "$10.00" },
  { id: 2, image: "https://picsum.photos/id/20/300", price: "$10.00" },
  { id: 3, image: "https://picsum.photos/id/30/300", price: "$10.00" },
  { id: 4, image: "https://picsum.photos/id/40/300", price: "$10.00" },
  { id: 5, image: "https://picsum.photos/id/50/300", price: "$10.00" },
  { id: 6, image: "https://picsum.photos/id/60/300", price: "$10.00" },
  { id: 7, image: "https://picsum.photos/id/70/300", price: "$10.00" },
  { id: 8, image: "https://picsum.photos/id/80/300", price: "$10.00" },
  { id: 9, image: "https://picsum.photos/id/90/300", price: "$10.00" },
  { id: 10, image: "https://picsum.photos/id/70/300", price: "$10.00" },
  { id: 11, image: "https://picsum.photos/id/80/300", price: "$10.00" },
  { id: 12, image: "https://picsum.photos/id/90/300", price: "$10.00" },
];

function App() {

  const [menuOpen, setMenuOpen] = useState(false);

  return (

    
    
    <div className="flex h-screen flex-col">
  
      <header className="flex h-[75px] items-center justify-between bg-neutral-800 px-6">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-8 w-8 flex-col justify-between py-1 cursor-pointer"
          aria-label="Toggle menu"
        >
          <span className="h-[3px] w-full rounded bg-white"></span>
          <span className="h-[3px] w-full rounded bg-white"></span>
          <span className="h-[3px] w-full rounded bg-white"></span>
        </button>

        <div className="h-12 w-12 rounded-full bg-white"></div> {/* avatar */}
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-[30%] bg-white">{/* side bar */}</aside>

        <main className="flex-1 overflow-y-auto bg-neutral-500 p-4">
          {/* search bar code */}
          <input
            type="text"
            placeholder="Search..."
            className="mb-4 h-10 w-full rounded bg-neutral-400 px-3 placeholder-neutral-600 outline-none"
          />

          <div className="mx-auto grid max-w-5xl grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} image={p.image} price={p.price} />
            ))}
          </div>
        </main>

        {/*click outside to close the side bar code:*/}
        {menuOpen && (
          <div
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 top-[75px] z-0 bg-black/40"
          ></div>
        )}

        <aside
          className={`fixed left-0 top-[75px] z-10 h-[calc(100vh-75px)] w-64 bg-neutral-800 p-6 text-white transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <p className="mb-4 text-lg font-semibold">Menu</p>
          <ul className="space-y-3">
            <li>Home</li>
            <li>Shop</li>
            <li>Inventory</li>
            <li>Settings</li>
          </ul>
        </aside>
      </div>
    </div>
  );
}

export default App;