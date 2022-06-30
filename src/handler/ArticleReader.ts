// eslint-disable-next-line import/no-unresolved
import { Context, SNSEvent, SNSHandler } from "aws-lambda";

export const articleReader: SNSHandler = async (event: SNSEvent) => {
  console.log(`Event received: ${event}`);
};
