import { useState, useEffect } from "react";

// Base URL of the Cloudflare pipeline Worker that serves the data API.
// Set NEXT_PUBLIC_API_BASE in .env.local (dev) and in the build env (prod):
//   dev:  http://localhost:8787
//   prod: https://very-bad-media-pipeline.<your-subdomain>.workers.dev
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

async function getJson(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export const fetchEpisodes = () => getJson("/api/episodes");
export const fetchLetterboxd = () => getJson("/api/letterboxd");

// Generic client-side fetch hook with loading/error state.
export function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setData(null);
    setError(null);
    fetcher()
      .then((d) => active && setData(d))
      .catch((e) => active && setError(e.message));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, error, loading: data === null && !error };
}
