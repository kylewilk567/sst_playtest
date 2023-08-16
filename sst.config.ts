import { SSTConfig } from "sst";
import { NextjsSite, Bucket, Table, Script } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "creator",
      region: "us-east-2",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      // Add database table - serves creator site needs
      const creatorTable = new Table(stack, "creator", {
        fields: {
          pk: "string",
          sk: "string",
          gsi1pk: "string",
          gsi1sk: "string",
        },
        primaryIndex: {
          partitionKey: "pk",
          sortKey: "sk",
        },
        globalIndexes: {
          gsi1: {
            partitionKey: "gsi1pk",
            sortKey: "gsi1sk",
            projection: ["creatorId", "username", "email"],
          },
        },
      });

      // Database seeding script
      new Script(stack, "CreatorDataSeedScript", {
        defaults: {
          function: {
            bind: [creatorTable],
          },
        },
        onCreate: "functions/seed.handler",
      });

      // Table to store user information from next-auth
      const nextAuthTable = new Table(stack, "next-auth", {
        timeToLiveAttribute: "expires", // attribute name for ttl expiration time
        fields: {
          pk: "string",
          sk: "string",
          GSI1PK: "string",
          GSI1SK: "string",
        },
        primaryIndex: {
          partitionKey: "pk",
          sortKey: "sk",
        },
        globalIndexes: {
          GSI1: {
            partitionKey: "GSI1PK",
            sortKey: "GSI1SK",
          },
        },
      });

      // Add S3 bucket
      const bucket = new Bucket(stack, "public");

      const site = new NextjsSite(stack, "site", {
        bind: [creatorTable, nextAuthTable, bucket],
        environment: {
          NEXT_AUTHURL: process.env.NEXTAUTH_URL as string,
          NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET as string,
          GOOGLE_ID: process.env.GOOGLE_ID as string,
          GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
          // AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY as string,
          // AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY as string,
        },
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
