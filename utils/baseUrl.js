const DEFAULT_PORT = process.env.PORT || 8001;

function normalizeBaseURL(baseURL) {
  if (!baseURL || typeof baseURL !== "string") return "";

  const trimmedURL = baseURL.trim().replace(/\/+$/, "");
  if (!trimmedURL) return "";

  if (/^https?:\/\//i.test(trimmedURL)) {
    return trimmedURL;
  }

  return `https://${trimmedURL}`;
}

function getRequestOrigin(req) {
  if (!req) return "";

  const forwardedHost = req.get("x-forwarded-host");
  const host = forwardedHost || req.get("host");
  if (!host) return "";

  const forwardedProto = req.get("x-forwarded-proto");
  const protocol = forwardedProto ? forwardedProto.split(",")[0].trim() : req.protocol;

  return `${protocol}://${host}`;
}

function isLocalhostURL(baseURL) {
  try {
    const { hostname } = new URL(baseURL);
    return hostname === "localhost" || hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

function getBaseURL(req) {
  const configuredBaseURL = normalizeBaseURL(process.env.BASE_URL);
  const requestOrigin = normalizeBaseURL(getRequestOrigin(req));

  if (configuredBaseURL && !(requestOrigin && isLocalhostURL(configuredBaseURL))) {
    return configuredBaseURL;
  }

  return requestOrigin || configuredBaseURL || `http://localhost:${DEFAULT_PORT}`;
}

module.exports = {
  getBaseURL,
};
