import { createClient } from "contentful";

export const contentfulClient = createClient({
  space: import.meta.env.VITE_CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN,
});

// ── Shared cache: every section asks for the same entry, so fetch it once ──
const cache = new Map();
const rawGetEntries = contentfulClient.getEntries.bind(contentfulClient);

contentfulClient.getEntries = (query = {}) => {
  const key = JSON.stringify(query);
  if (!cache.has(key)) {
    const request = rawGetEntries(query).catch((err) => {
      cache.delete(key); // allow a retry after a failure
      throw err;
    });
    cache.set(key, request);
  }
  return cache.get(key);
};

// Start the request early (while the loader is showing)
export const prefetchPortfolio = () =>
  contentfulClient.getEntries({ content_type: "myportfolio", limit: 1 });