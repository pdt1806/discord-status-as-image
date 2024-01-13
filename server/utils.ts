export function base64toBlob(base64: string): Blob | null {
  const match = base64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);

  if (!match) {
    console.error('Invalid base64 string format');
    return null;
  }

  const contentType = match[1];
  const byteCharacters = atob(match[2]);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
}

export const fetchData = async (id: string) => {
  const response = await fetch(`http://127.0.0.1:7000/user/${id}`);
  try {
    if (response.status === 404) {
      return null;
    }
  } catch {
    throw new Error('Internal Server Error');
  }
  return (await response.json()) as {
    [key: string]: string;
  };
};
