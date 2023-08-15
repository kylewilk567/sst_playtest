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
      // new Script(stack, "CreatorDataSeedScript", {
      //   defaults: {
      //     function: {
      //       bind: [creatorTable],
      //     },
      //   },
      //   onCreate: "functions/seed.handler",
      // });

      // Add S3 bucket
      const bucket = new Bucket(stack, "public");

      const site = new NextjsSite(stack, "site", {
        bind: [creatorTable, bucket],
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
