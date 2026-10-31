import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Request } from "express";
import { customAlphabet } from "nanoid";
import { lowercase_and_number } from "./const";

const r2BucketName = process.env.R2_BUCKET_NAME;
const r2AccountId = process.env.R2_ACCOUNT_ID;
const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID;
const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

// ---------------------------------------------

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
  const timestamp = new Date().toLocaleString("en-GB", {
    hour12: false,
  });
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

export type FolderName = "banners" | "other";

// Return image ID of the banner after uploading to R2.
export const uploadImageToR2 = async (
  userId: string,
  type: FolderName,
  file: File,
) => {
  if (!r2BucketName || !r2AccountId || !r2AccessKeyId || !r2SecretAccessKey) {
    throw new Error("R2 credentials are not set in environment variables.");
  }

  const filename = customAlphabet(lowercase_and_number, 15)();

  const url = `https://${r2AccountId}.r2.cloudflarestorage.com/`;

  const s3 = new S3Client({
    endpoint: url,
    region: "auto",
    credentials: {
      accessKeyId: r2AccessKeyId,
      secretAccessKey: r2SecretAccessKey,
    },
  });

  const params = {
    Bucket: r2BucketName,
    Key: `${type}/${userId}/${filename}`,
    Body: new Uint8Array(await file.arrayBuffer()),
    ContentType: file.type,
  };

  const response = await s3.send(new PutObjectCommand(params));

  if (response.$metadata.httpStatusCode !== 200) {
    throw new Error("Failed to upload image to R2.");
  }

  return filename;
};
