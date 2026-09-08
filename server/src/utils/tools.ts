import { Request } from "express";

export function base64toFile(base64: string): File | null {
  const match = base64.match(
    /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/,
  );

  if (!match) return null;

  const contentType = match[1];
  const byteCharacters = atob(match[2]);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i += 1) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  const blob = new Blob([byteArray], { type: contentType });

  const fileName = `${Math.random().toString(36).substring(2, 8)}`;

  return new File([blob], fileName, { type: contentType });
}

export const logTimestamp = (
  type: string,
  format: string,
  id: string,
  browserTime: number,
) => {
  const timestamp = new Date().toLocaleString();
  console.log(`[${timestamp}] ${id}, ${type}, ${format}, ${browserTime}ms`);
};

export const joinedParams = (req: Request) => {
  const forwardedParams = new URLSearchParams();
  Object.entries(req.query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => forwardedParams.append(key, String(item)));
    } else if (value !== undefined) {
      forwardedParams.append(key, String(value));
    }
  });
  return forwardedParams.toString();
};
