import { useEffect, useState } from "react";
import {
  collection,
  documentId,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "../firebase";

const PRICE_HISTORY_LIMIT = 90;

function toHistoryDate(value) {
  if (value && typeof value.toDate === "function") return value.toDate();
  if (value instanceof Date) return value;

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error("A price history entry has an invalid date.");
  }
  return date;
}

export function usePriceHistory(productId) {
  const normalizedProductId = productId == null ? "" : String(productId);
  const [result, setResult] = useState({
    productId: null,
    data: [],
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!normalizedProductId || !db || !isFirebaseConfigured) return undefined;

    const historyQuery = query(
      collection(db, "products", normalizedProductId, "priceHistory"),
      orderBy(documentId(), "desc"),
      limit(PRICE_HISTORY_LIMIT),
    );

    return onSnapshot(
      historyQuery,
      (snapshot) => {
        try {
          const data = snapshot.docs
            .map((document) => {
              const entry = document.data();
              const price = Number(entry.price);
              if (
                entry.price == null ||
                entry.price === "" ||
                !Number.isFinite(price)
              ) {
                throw new Error("A price history entry has an invalid price.");
              }

              return {
                date: toHistoryDate(entry.date ?? document.id),
                price,
              };
            })
            .reverse();

          setResult({
            productId: normalizedProductId,
            data,
            loading: false,
            error: null,
          });
        } catch (error) {
          setResult({
            productId: normalizedProductId,
            data: [],
            loading: false,
            error,
          });
        }
      },
      (error) => {
        setResult({
          productId: normalizedProductId,
          data: [],
          loading: false,
          error,
        });
      },
    );
  }, [normalizedProductId]);

  if (!normalizedProductId) return { data: [], loading: false, error: null };
  if (!isFirebaseConfigured || !db) {
    return {
      data: [],
      loading: false,
      error: new Error("Firebase is not configured. Add your .env.local values."),
    };
  }
  if (result.productId !== normalizedProductId) {
    return { data: [], loading: true, error: null };
  }

  return { data: result.data, loading: result.loading, error: result.error };
}
