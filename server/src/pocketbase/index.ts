import "../config";
import PocketBase from "pocketbase";

const pocketbase = new PocketBase("https://pocketbase.disi.fyi");

await pocketbase
  .collection("_superusers")
  .authWithPassword(process.env.DISI_POCKETBASE_EMAIL as string, process.env.DISI_POCKETBASE_PASSWORD as string);

export const uploadBannerImage = async (image: Blob) => {
  const pbImage = await pocketbase.collection("banners").create({ image }, { requestKey: null });
  return pbImage.id;
};
