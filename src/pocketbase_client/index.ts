import PocketBase from "pocketbase";
import { DocumentProps } from "../utils/types";
// eslint-disable-next-line import/no-cycle

const pocketbase = new PocketBase("https://disi-pb.bennynguyen.dev");

export const getBannerImage = async (
  id: string,
  validating: boolean = false,
) => {
  try {
    const imageModel = await pocketbase
      .collection("banners")
      .getOne(id, { requestKey: null });
    if (!imageModel) return null;
    if (!validating)
      return pocketbase.files.getURL(imageModel, imageModel.image);
    return true;
  } catch {
    return null;
  }
};

export const getDocument = async (id: string): Promise<DocumentProps | null> =>
  pocketbase.collection("documents").getOne(id, { requestKey: null });
