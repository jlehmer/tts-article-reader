// eslint-disable-next-line import/no-unresolved
import { Context, SNSEvent } from 'aws-lambda';
import * as handler from '../../src/handler/TtsResultHandler';

describe('Text to speech result handler tests', () => {
  const mockEvent = {
    Records: [
      {
        Sns: {
          Message: 'mock message',
        },
      },
    ],
  };

  it('receiveTtsResult() does not throw an error when called', async () => {
    await handler.receiveTtsResult(mockEvent as SNSEvent, {} as Context, null);
  });
});
