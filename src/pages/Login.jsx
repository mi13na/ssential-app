import { Navigate } from "react-router-dom";
import { useAuth } from "../auth";
import Spinner from "../Spinner";

function Login() {
  const { user, loading, signIn } = useAuth();

  if (loading) return <Spinner />;
  if (user) return <Navigate to="/" replace />;

  return (
    <div className="flex h-screen items-center justify-center bg-neutral-500 p-4">
      <div className="w-full max-w-sm rounded bg-white p-8 text-center">
        <h1 className="text-3xl font-bold">ssential app</h1>
        <p className="mt-3 text-neutral-700">
          Browse clothing from SSENSE in one place and save your favorites to a wishlist.
        </p>
        <button
          onClick={() => signIn()}
          className="mt-6 w-full cursor-pointer rounded bg-neutral-800 px-4 py-3 font-semibold text-white"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}

export default Login;