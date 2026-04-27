type JwtPayload = Record<string, unknown>;

const decodeBase64Url = (value: string) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const atobFn = globalThis.atob as ((data: string) => string) | undefined;

  if (typeof atobFn === "function") {
    return atobFn(padded);
  }

  throw new Error("Base64 decoding is not available in this environment.");
};

export const decodeJwtPayload = <T extends JwtPayload = JwtPayload>(token: string): T | null => {
  const [, payload] = token.split(".");

  if (!payload) {
    return null;
  }

  try {
    return JSON.parse(decodeBase64Url(payload)) as T;
  } catch {
    return null;
  }
};

const getStringValue = (payload: JwtPayload, keys: string[]) => {
  for (const key of keys) {
    const value = payload[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
};

export const buildDisplayNameFromJwt = (payload: JwtPayload, fallback = "Relty User") => {
  const parts = [
    getStringValue(payload, ["firstname", "firstName", "given_name"]),
    getStringValue(payload, ["middlename", "middleName", "middle_name"]),
    getStringValue(payload, ["lastname", "lastName", "family_name"])
  ].filter((part) => part && part.toLowerCase() !== "not provided");

  if (parts.length > 0) {
    return parts.join(" ");
  }

  return fallback;
};

export const resolvePhoneFromJwt = (payload: JwtPayload, fallback = "") => {
  return getStringValue(payload, ["mobile", "phone", "tel"]) || fallback;
};
