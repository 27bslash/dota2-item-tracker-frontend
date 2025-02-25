import { baseApiUrl } from "./../App";
export const fetchData = async (url: string, retries = 2, delay = 1000) => {
  const newUrl = url.replace(/(\?.*?)\?(.*)/gm, "$1&$2");
  for (let i = 0; i < retries; i++) {
    let response = await fetch(newUrl);
    if (response.status === 200) return await response.json();
    if (response.status === 304) {
      response = await fetch(newUrl.replace(/&time=\d*/, ""));
      return await response.json();
    } else if (response.status === 429) {
      const retryAfter = response.headers.get("retry-after");
      const waitTime = retryAfter
        ? parseInt(retryAfter, 10) * 1000
        : delay * (i + 1);
      console.log(
        `Rate limited. ${url} Retrying in ${waitTime / 1000} seconds...`
      );
      await new Promise((res) => setTimeout(res, waitTime));
    }
  }
};
export async function fetchItems(url: string) {
  // Retrieve stored ETag (if any) from localStorage
  const cachedEtagData = JSON.parse(localStorage.getItem("etagCache") || "[]");

  const findEtag = (url: string) =>
    cachedEtagData.find(
      (entry: { [key: string]: string }) => entry.url === url
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
          response.headers.get("Last-Modified")!
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
  newLastModified: string
) => {
  const etagCache = JSON.parse(localStorage.getItem("etagCache") || "[]");
  if (!newEtag || !newLastModified) {
    console.warn(`no new etag or last modified for some reason for ${url}`);
    return;
  }
  const index = etagCache.findIndex(
    (entry: { url: string }) => entry.url === url
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
  start: number
) => {
  const urlList = [];
  let chunk = Math.ceil((docLength - start) / 6);
  if (chunk < 10) chunk = Math.ceil((docLength - start) / 3);
  let skip = start;
  for (let i = 0; i < +docLength - start; i += chunk) {
    const url = `${baseUrl}?skip=${skip}&length=${chunk}`;
    urlList.push(url);
    skip += chunk;
  }
  const data = await Promise.all(
    urlList.map((innerPromiseArray) => {
      return fetchData(innerPromiseArray);
    })
  );
  return data;
};
