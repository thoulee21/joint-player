import fetchRetry from 'fetch-retry';

export const fetchPlus = fetchRetry(fetch, { retries: 3, retryDelay: 1000 });
