import Image from "next/image";
import crypto from "crypto";
import { Bucket } from "sst/node/bucket"; // These can ONLY be used on server side components!!
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Form from "@components/Form";
import Nav from "@components/Nav";

// Note: PutObjectCommand is the same to be used for editing an object (will overwrite if exists)

export default async function Home() {
  const command = new PutObjectCommand({
    ACL: "private",
    Key: crypto.randomUUID(), // NOTE: Use string to set directory path as well such as "users/{user}/filename.txt"
    Bucket: Bucket.public.bucketName,
  });

  // Note: getSignedUrl allows unauthorized uploads (ie: random client). This cannot be used alongside
  // Api keys in headless setup, so instead make client query headless setup in order to upload and check
  // perms there
  // Note: The above setup slows things down as they must query our api, and then we query S3, (takes 2x as long)

  const url = await getSignedUrl(new S3Client({}), command);

  return (
    <>
      <Nav />

      <Form url={url} />
    </>
  );
}
