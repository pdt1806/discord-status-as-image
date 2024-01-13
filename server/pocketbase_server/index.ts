import * as dotenv from 'dotenv';
import path from 'path';
import PocketBase from 'pocketbase';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: __dirname + '/.env' });

const pocketbase = new PocketBase('https://disi-pb.bennynguyen.dev');

await pocketbase.admins.authWithPassword(
  process.env.POCKETBASE_EMAIL as string,
  process.env.POCKETBASE_PASSWORD as string
);

export const uploadBannerImage = async (image: Blob) => {
  const pbImage = await pocketbase.collection('banners').create({ image }, { requestKey: null });
  return pbImage.id;
};
