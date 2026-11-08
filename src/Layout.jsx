// import { useState } from "react";
// import { Link, Outlet } from "react-router-dom";

// function Layout() {
//   const [menuOpen, setMenuOpen] = useState(false);

//   return (
//     <div className="flex h-screen flex-col">
//       <header className="flex h-[75px] items-center justify-between bg-neutral-800 px-6">
//         <button
//           onClick={() => setMenuOpen(!menuOpen)}
//           className="flex h-8 w-8 cursor-pointer flex-col justify-between py-1"
//           aria-label="Toggle menu"
//         >
//           <span className="h-[3px] w-full rounded bg-white"></span>
//           <span className="h-[3px] w-full rounded bg-white"></span>
//           <span className="h-[3px] w-full rounded bg-white"></span>
//         </button>

//         <h1 className="text-2xl font-bold text-white">ssential app</h1>

//         <div className="h-12 w-12 rounded-full bg-white"></div>
//       </header>

//       {menuOpen && (
//         <div
//           onClick={() => setMenuOpen(false)}
//           className="fixed inset-0 top-[75px] z-[5] bg-black/40"
//         ></div>
//       )}

//       <aside
//         className={`fixed left-0 top-[75px] z-10 h-[calc(100vh-75px)] w-[30%] bg-neutral-800 p-6 text-xl text-white transition-transform duration-300 ${
//           menuOpen ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         <p className="mb-4 text-2xl font-semibold">Menu</p>
//         <ul className="space-y-4">
//           <li>
//             <Link to="/" onClick={() => setMenuOpen(false)}>Shop</Link>
//           </li>
//           <li>
//             <Link to="/inventory" onClick={() => setMenuOpen(false)}>Inventory</Link>
//           </li>
//           <li>
//             <Link to="/wishlist" onClick={() => setMenuOpen(false)}>Wishlist</Link>
//           </li>
//           <li>Settings</li>
//         </ul>
//       </aside>

//       <div className="flex flex-1 overflow-hidden">
//         <aside className="w-[30%] bg-white">{/* side bar */}</aside>

//         <main className="flex-1 overflow-y-auto bg-neutral-500 p-4">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }

// export default Layout;

import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "./auth";

function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, loading, signOut } = useAuth();

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-[75px] items-center justify-between bg-neutral-800 px-6">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-8 w-8 cursor-pointer flex-col justify-between py-1"
          aria-label="Toggle menu"
        >
          <span className="h-[3px] w-full rounded bg-white"></span>
          <span className="h-[3px] w-full rounded bg-white"></span>
          <span className="h-[3px] w-full rounded bg-white"></span>
        </button>

        <h1 className="text-2xl font-bold text-white">ssential app</h1>

        <div className="relative">
          {loading ? (
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
          ) : user ? (
            <>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="cursor-pointer"
                aria-label="Account menu"
              >
                <img
                  src={user.photoURL}
                  alt="Profile"
                  referrerPolicy="no-referrer"
                  className="h-12 w-12 rounded-full object-cover"
                />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-14 z-30 w-32 rounded bg-white py-1 shadow">
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      signOut();
                    }}
                    className="w-full cursor-pointer px-4 py-2 text-left hover:bg-neutral-200"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link
              to="/login"
              className="rounded bg-white px-4 py-2 text-sm font-semibold text-neutral-800"
            >
              Sign in
            </Link>
          )}
        </div>
      </header>

      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 top-[75px] z-[5] bg-black/40"
        ></div>
      )}

      <aside
        className={`fixed left-0 top-[75px] z-10 h-[calc(100vh-75px)] w-[30%] bg-neutral-800 p-6 text-xl text-white transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <p className="mb-4 text-2xl font-semibold">Menu</p>
        <ul className="space-y-4">
          <li>
            <Link to="/" onClick={() => setMenuOpen(false)}>Shop</Link>
          </li>
          <li>
            <Link to="/inventory" onClick={() => setMenuOpen(false)}>Inventory</Link>
          </li>
          <li>
            <Link to="/wishlist" onClick={() => setMenuOpen(false)}>Wishlist</Link>
          </li>
          <li>Settings</li>
        </ul>
      </aside>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-[30%] bg-white">{/* side bar */}</aside>

        <main className="flex-1 overflow-y-auto bg-neutral-500 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;