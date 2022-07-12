// eslint-disable-next-line import/no-unresolved
import { Context, SNSEvent } from 'aws-lambda';
import * as handler from '../../src/handler/TtsResultHandler';
import { DatabaseService } from '../../src/service/DatabaseService';

describe('Text to speech result handler tests', () => {
  const mockSaveTtsTask = jest.fn();
  const mockEvent = {
    Records: [
      {
        Sns: {
          Message: "{\"taskId\":\"b5bf8ba7-6758-4782-ba32-f74cb834470b\",\"taskStatus\":\"COMPLETED\",\"outputUri\":\"s3://tts-article-result/todoId-1234-5678/b5bf8ba7-6758-4782-ba32-f74cb834470b.mp3\",\"creationTime\":\"2022-07-12T02:55:08.937Z\",\"requestCharacters\":17818,\"snsTopicArn\":\"arn:aws:sns:us-east-2:373636017697:tts-results\",\"outputFormat\":\"Mp3\",\"textType\":\"Text\",\"voiceId\":\"Joanna\"}",
        },
      },
    ],
  };

  beforeEach(() => {
    mockSaveTtsTask.mockReset();
  });

  it('receiveTtsResult() does not throw an error when db save is successful', async () => {
    DatabaseService.prototype.saveTtsResult = mockSaveTtsTask;
    mockSaveTtsTask.mockResolvedValueOnce(true);

    await handler.receiveTtsResult(mockEvent as SNSEvent, {} as Context, null);

    expect(mockSaveTtsTask).toBeCalledWith('1234-5678', expect.objectContaining({}));
  });

  it('receiveTtsResult() does not throw an error when db save fails', async () => {
    DatabaseService.prototype.saveTtsResult = mockSaveTtsTask;
    mockSaveTtsTask.mockResolvedValueOnce(false);

    await handler.receiveTtsResult(mockEvent as SNSEvent, {} as Context, null);

    expect(mockSaveTtsTask).toBeCalledTimes(1);
  });
});
