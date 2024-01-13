import PocketBase from 'pocketbase';
import { DocumentProps } from '../pages/Document';

const pocketbase = new PocketBase('https://disi-pb.bennynguyen.dev');

export const getBannerImage = async (id: string, validating: boolean = false) => {
  try {
    const imageModel = await pocketbase.collection('banners').getOne(id, { requestKey: null });
    if (!imageModel) return null;
    if (!validating) return await pocketbase.getFileUrl(imageModel, imageModel.image);
    return true;
  } catch {
    return null;
  }
};

export const getDocument = async (id: string): Promise<DocumentProps | null> => {
  return await pocketbase.collection('documents').getOne(id, { requestKey: null });
};
