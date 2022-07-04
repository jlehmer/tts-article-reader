// eslint-disable-next-line import/no-unresolved
import { SNSEvent, SNSHandler } from 'aws-lambda';

export const receiveTtsResult: SNSHandler = async (event: SNSEvent) => {
  console.log(`Event received: ${event}`);
};
