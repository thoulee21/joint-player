import fetchRetry from "fetch-retry";
import type { Main } from "../types/playlistDetail";

export const fetcher = async (url: string): Promise<Main> => {
  const response = await fetchRetry(fetch, {
    retries: 20,
    retryDelay: function (attempt: number) {
      return Math.pow(2, attempt) * 1000; // 1000, 2000, 4000
    },
  })(url);
  const data = await response.json();
  return data;
};
