import { debugging, refinerAPI } from '../src/env/env';
import { RefinerResponse } from '../src/utils/types';

export function base64toFile(base64: string): File | null {
  const match = base64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);

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

export const fetchData = async (id: string): Promise<RefinerResponse | null> => {
  const response = await fetch(`${refinerAPI[debugging]}/user/${id}`);
  try {
    if (response.status === 404) {
      return null;
    }
  } catch {
    throw new Error('Internal Server Error');
  }
  return response.json();
};

export async function urlToBase64(imgUrl: string): Promise<string> {
  const fetchImageUrl = await fetch(imgUrl);
  const responseArrBuffer = await fetchImageUrl.arrayBuffer();
  const toBase64 = `data:${fetchImageUrl.headers.get('Content-Type') || 'image/png'};base64,${Buffer.from(responseArrBuffer).toString('base64')}`;
  return toBase64;
}
