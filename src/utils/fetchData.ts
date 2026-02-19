import { baseApiUrl } from "./../App";
export const fetchData = async (url: string, retries = 2, delay = 1000) => {
  const newUrl = url.replace(/(\?.*?)\?(.*)/gm, "$1&$2");
  const wait = (ms: number) =>
    new Promise((res) => {
      setTimeout(res, ms);
    });

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      let response = await fetch(newUrl);
      if (response.status === 200) return await response.json();
      if (response.status === 304) {
        response = await fetch(newUrl.replace(/&time=\d*/, ""));
        return await response.json();
      }

      if (response.status === 429) {
        const retryAfter = response.headers.get("retry-after");
        const waitTime = retryAfter
          ? parseInt(retryAfter, 10) * 1000
          : delay * attempt;
        console.log(
          `Rate limited. ${url} Retrying in ${waitTime / 1000} seconds...`,
        );
        await wait(waitTime);
        continue;
      }

      if (attempt === retries) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      await wait(delay * attempt);
    } catch (error) {
      if (attempt === retries) throw error;
      await wait(delay * attempt);
    }
  }
};
export async function fetchItems(url: string) {
  // Retrieve stored ETag (if any) from localStorage
  const cachedEtagData = JSON.parse(localStorage.getItem("etagCache") || "[]");

  const findEtag = (url: string) =>
    cachedEtagData.find(
      (entry: { [key: string]: string }) => entry.url === url,
    );
  const storedETag = findEtag(url);

  const headers: { [key: string]: string } = {
    "If-None-Match": "",
    "If-Modified-Since": "",
  };
  if (storedETag) {
    headers["If-None-Match"] = storedETag.etag; // Ask server if there's a newer version
    headers["If-Modified-Since"] = storedETag.lastModified;
  }
  try {
    const response = await fetch(`${baseApiUrl}${url}`, { headers });
    if (response.status === 304) {
      console.log(`No update needed, for ${url} using cached data`);
      return null;
    }

    if (response.ok) {
      const data = await response.json();
      if (response.headers.get("ETag")) {
        updateEtag(
          url,
          response.headers.get("ETag")!,
          response.headers.get("Last-Modified")!,
        );
      }
      return data;
    } else {
      throw new Error(`HTTP Error: ${response.status}`);
    }
  } catch (error) {
    console.error("Fetch failed:", error);
    return null;
  }
}
export const updateEtag = (
  url: string,
  newEtag: string,
  newLastModified: string,
) => {
  const etagCache = JSON.parse(localStorage.getItem("etagCache") || "[]");
  if (!newEtag || !newLastModified) {
    console.warn(`no new etag or last modified for some reason for ${url}`);
    return;
  }
  const index = etagCache.findIndex(
    (entry: { url: string }) => entry.url === url,
  );
  if (index !== -1) {
    etagCache[index].etag = newEtag;
    etagCache[index].lastModified = newLastModified;
  } else {
    etagCache.push({ url, etag: newEtag, lastModified: newLastModified });
  }
  localStorage.setItem("etagCache", JSON.stringify(etagCache));
};

export const bulkRequest = async (
  baseUrl: string,
  docLength: number,
  start: number,
) => {
  const urlList = [];
  const remaining = docLength - start;
  let chunk = Math.ceil(remaining / 6);
  if (chunk < 10) chunk = Math.ceil(remaining / 3);
  let skip = start;
  for (let i = 0; i < +docLength - start; i += chunk) {
    const url = `${baseUrl}?skip=${skip}&length=${chunk}`;
    urlList.push(url);
    skip += chunk;
  }
  const data = await Promise.all(
    urlList.map((innerPromiseArray) => {
      return fetchData(innerPromiseArray);
    }),
  );
  return data;
};

export const bulkRequestStaged = async <T>(
  baseUrl: string,
  docLength: number,
  start: number,
  options: {
    seedData: T[];
    onStage: (accumulated: T[], chunk: T[]) => void;
  },
) => {
  const merged: T[] = [...options.seedData];
  const total = Math.max(docLength, 0);
  const remaining = Math.max(total - start, 0);
  let generatedChunk = Math.ceil(remaining / 6);
  if (generatedChunk < 10) generatedChunk = Math.ceil(remaining / 3);
  const safeStageSize = Math.max(1, generatedChunk);
  for (let skip = start; skip < total; skip += safeStageSize) {
    const length = Math.min(safeStageSize, total - skip);
    const url = `${baseUrl}?skip=${skip}&length=${length}`;
    const response = await fetchData(url);
    let chunk: T[];
    if (Array.isArray(response)) {
      chunk = response;
    } else if (
      response &&
      typeof response === "object" &&
      Array.isArray(response.data)
    ) {
      chunk = response.data;
    } else {
      chunk = [];
    }
    if (!chunk.length) {
      continue;
    }
    merged.push(...chunk);
    if (options.onStage) {
      options.onStage([...merged], chunk);
    }
  }

  return merged;
};
