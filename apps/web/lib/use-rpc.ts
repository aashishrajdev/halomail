"use client";

import { useCallback, useEffect, useState } from "react";
import { rpc } from "./api";
import { getToken } from "./auth";

export function useRpc<T>(procedure: string, body: unknown = {}) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const key = JSON.stringify(body);
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await rpc<T>(procedure, JSON.parse(key), getToken()));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [procedure, key]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}
