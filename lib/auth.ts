/**
 * Authentification minimaliste à mot de passe unique (administrateur).
 * Le cookie de session contient un dérivé SHA-256 du mot de passe (jamais le
 * mot de passe en clair). Compatible runtime Node (server actions) ET Edge
 * (middleware) : n'utilise que Web Crypto et process.env.
 */
export const SESSION_COOKIE = "daara_session";

export async function deriveSessionToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(`daara-ndk-session::${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function isValidSession(
  token: string | undefined | null
): Promise<boolean> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || !token) {
    return false;
  }
  const expected = await deriveSessionToken(password);
  return token.length === expected.length && token === expected;
}
