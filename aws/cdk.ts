#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { PublicApiStack } from "./publicApiStack";

const app = new cdk.App();
const appName = "public-api-" + app.node.tryGetContext("target");

new PublicApiStack(app, appName, {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
