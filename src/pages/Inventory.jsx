import { useAuth } from "../auth/useAuth";
import { useFirestoreCollection } from "../hooks/useFirestoreCollection";

function Inventory() {
  const { user, isConfigured } = useAuth();
  const { documents, loading, error } = useFirestoreCollection(
    user ? `users/${user.uid}/inventory` : null,
    Boolean(user),
  );

  return (
    <div>
      <h1 className="mb-4 text-3xl font-bold text-white">Inventory</h1>
      {!isConfigured ? (
        <p className="text-white">Configure Firebase to load your inventory.</p>
      ) : !user ? (
        <p className="text-white">Sign in with Google to load your inventory.</p>
      ) : loading ? (
        <p className="text-white">Loading inventory...</p>
      ) : error ? (
        <p role="alert" className="text-red-100">
          Could not load inventory: {error.message}
        </p>
      ) : documents.length === 0 ? (
        <p className="text-white">No documents found in your inventory.</p>
      ) : (
        <ul className="space-y-3">
          {documents.map(({ id, ...fields }) => (
            <li key={id} className="rounded bg-white p-4">
              <pre className="overflow-x-auto text-sm">
                {JSON.stringify({ id, ...fields }, null, 2)}
              </pre>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Inventory;
