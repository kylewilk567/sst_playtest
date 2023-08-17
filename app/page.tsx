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
import { Creator } from "@utils/entities";
import { Dynamo } from "@utils/dynamo";
import { ElectroEvent } from "electrodb";

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

  // (e: ElectroEvent) => { console.log(JSON.stringify(e, null 2)}
  // const params = await Creator.query
  //   .emails({
  //     email: "kylewilk@umich.edu",
  //   })
  //   .params({
  //     data: "attributes",
  //     attributes: ["creatorId", "email", "username"],
  //     logger: (e: ElectroEvent) => {
  //       console.log(JSON.stringify(e, null, 2));
  //     },
  //   });
  // console.log(params);

  const response1 = await Creator.query
    .emails({
      email: "kylewilk@umich.edu",
    })
    .go({
      // data: "attributes",
      // attributes: ["creatorId", "email", "username"],
      logger: (e: ElectroEvent) => {
        console.log(JSON.stringify(e, null, 2));
      },
    });
  console.log(response1);
  console.log(response1.data);
  //console.log(response1.data?.Items[0]);

  return (
    <>
      <Nav />

      <Form url={url} />
    </>
  );
}
