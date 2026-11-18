# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Firebase setup

1. Create a Firebase project and register a Web app.
2. In Firebase Console, enable Google under **Authentication → Sign-in method** and create a Firestore database.
3. Add `localhost` and your deployed hostname under **Authentication → Settings → Authorized domains**.
4. Copy `.env.example` to `.env.local` and fill in the Web app config values from **Project settings → General → Your apps**. Restart the Vite dev server after changing environment variables.
5. Firestore product documents use `product_id`, `image_url`, `displayed_price`, and `currency`; the Shop maps these fields to the product card's expected values.
6. The Inventory page reads each signed-in user's `users/{uid}/inventory` subcollection; documents are displayed as JSON until the collection schema is defined.

The `/login` page signs in with Google. The Shop waits for an authenticated user before reading and showing Firestore products and prices. In Firebase Console, authorize the hostname you use to run the app (for local development, `localhost`; add `127.0.0.1` too if you browse using that address). `src/auth/AuthProvider.jsx` provides Firebase auth state and actions. Other components can import `useAuth` from `src/auth/useAuth.js` and destructure `{ user, loading, signIn, signOut }` without importing or calling Firebase. `src/hooks/useFirestoreCollection.js` provides a realtime collection hook that returns `{ documents, loading, error }`.

Publish the rules in [firestore.rules](./firestore.rules) from **Firebase Console → Firestore Database → Rules**. Signed-in users can read products but cannot write them; users can read and write only their own `users/{uid}/...` documents. The Admin SDK scraper bypasses client rules. The Firebase web config is intended to be public; never put service-account credentials in this app or in a `VITE_` variable.

Wishlist items are stored at `users/{uid}/wishlist/{productId}` with `saved_at`, `saved_price`, and `notify: true`, so each user's saved products persist across sessions.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
