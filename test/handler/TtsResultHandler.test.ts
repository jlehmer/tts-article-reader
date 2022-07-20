// eslint-disable-next-line import/no-unresolved
import { TodoistApi } from '@doist/todoist-api-typescript';
import { Context, SNSEvent } from 'aws-lambda';
import * as handler from '../../src/handler/TtsResultHandler';
import { DatabaseService } from '../../src/service/DatabaseService';

const mockAddComment = jest.fn();

jest.spyOn(TodoistApi.prototype, 'addComment')
  .mockImplementation(mockAddComment);

describe('Text to speech result handler tests', () => {
  const mockSaveTtsTask = jest.fn();
  const mockEvent = {
    Records: [
      {
        Sns: {
          Message:
            '{"taskId":"7890-1234","taskStatus":"COMPLETED","outputUri":"s3://tts-article-result/todoId-12345678/b5bf8ba7-6758-4782-ba32-f74cb834470b.mp3","creationTime":"2022-07-12T02:55:08.937Z","requestCharacters":17818,"snsTopicArn":"arn:aws:sns:us-east-2:373636017697:tts-results","outputFormat":"Mp3","textType":"Text","voiceId":"Joanna"}',
        },
      },
    ],
  };

  beforeEach(() => {
    mockSaveTtsTask.mockReset();
    mockAddComment.mockReset();
  });

  it('receiveTtsResult() calls the Todois API as expected when all service updates are successful', async () => {
    const expectedTodoistApiInput = {
      // this is really the Todoist task id (not the TTS task id)
      taskId: 12345678,
      content: `[Listen to article](undefined?todoId=12345678&ref=7890-1234)`
    };

    DatabaseService.prototype.saveTtsResult = mockSaveTtsTask;
    mockSaveTtsTask.mockResolvedValueOnce(true);

    mockAddComment.mockResolvedValueOnce({});

    await handler.receiveTtsResult(mockEvent as SNSEvent, {} as Context, null);

    expect(mockSaveTtsTask).toBeCalledWith('12345678', expect.objectContaining({}));
    expect(mockAddComment).toBeCalledWith(expectedTodoistApiInput);
  });

  it('receiveTtsResult() does not throw an error when db save fails', async () => {
    DatabaseService.prototype.saveTtsResult = mockSaveTtsTask;
    mockSaveTtsTask.mockResolvedValueOnce(false);

    mockAddComment.mockResolvedValueOnce({});

    await handler.receiveTtsResult(mockEvent as SNSEvent, {} as Context, null);

    expect(mockSaveTtsTask).toBeCalledTimes(1);
    expect(mockAddComment).toBeCalledTimes(0);
  });

  it('receiveTtsResult() does not throw an error when Todoist API call fails', async () => {
    DatabaseService.prototype.saveTtsResult = mockSaveTtsTask;
    mockSaveTtsTask.mockResolvedValueOnce(true);

    mockAddComment.mockRejectedValueOnce('Mock error');

    await handler.receiveTtsResult(mockEvent as SNSEvent, {} as Context, null);

    expect(mockSaveTtsTask).toBeCalledTimes(1);
    expect(mockAddComment).toBeCalledTimes(1);
  });
});
