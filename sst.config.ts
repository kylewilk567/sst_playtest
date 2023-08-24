import { SSTConfig } from "sst";
import { NextjsSite, Bucket, Table, Script } from "sst/constructs";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";

const certArn =
  "arn:aws:acm:us-east-1:942373818465:certificate/d5089870-68b2-4b92-8048-ef55e19ad97b";

export default {
  config(_input) {
    return {
      name: "creator",
      region: "us-east-2",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const site = new NextjsSite(stack, "site", {
        environment: {
          NEXT_AUTHURL: process.env.NEXTAUTH_URL as string,
          NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET as string,
          GOOGLE_ID: process.env.GOOGLE_ID as string,
          GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
        },
        // Deploy to custom domain IFF deploying to prod stage only
        customDomain:
          stack.stage === "prod"
            ? {
                isExternalDomain: true,
                domainName: "creator.minemarket.xyz",
                cdk: {
                  certificate: Certificate.fromCertificateArn(
                    stack,
                    "CreatorCert",
                    certArn
                  ),
                },
              }
            : undefined,
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
