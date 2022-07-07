// eslint-disable-next-line import/no-unresolved
import { Context, SNSEvent } from 'aws-lambda';
import { PollyClient, StartSpeechSynthesisTaskCommand } from '@aws-sdk/client-polly';
import { mockClient } from 'aws-sdk-client-mock';
import * as handler from '../../src/handler/ArticleReaderHandler';
import { ArticleExtractService } from '../../src/service/ArticleExtractService';
import { DatabaseService } from '../../src/service/DatabaseService';

describe('Article Reader handler tests', () => {
  const pollyClientMock = mockClient(PollyClient);
  const mockRetrieveArticle = jest.fn();
  const mockSaveArticle = jest.fn();
  const mockSaveTtsTask = jest.fn();

  const mockArticleReaderEvent = {
    todoId: 'mockTodoId',
    articleUrl: 'mockArticleUrl',
  };

  const mockEvent = {
    Records: [
      {
        Sns: {
          Message: JSON.stringify(mockArticleReaderEvent),
        },
      },
    ],
  };

  beforeEach(() => {
    pollyClientMock.reset();
    mockRetrieveArticle.mockReset();
    mockSaveArticle.mockReset();
    mockSaveTtsTask.mockReset();
  });

  it('articleReader() does not throw an error when a successful extraction is done', async () => {
    ArticleExtractService.prototype.retrieveArticle = mockRetrieveArticle;
    mockRetrieveArticle.mockResolvedValueOnce({ text: 'mock article text' });

    DatabaseService.prototype.saveArticle = mockSaveArticle;
    mockSaveArticle.mockResolvedValueOnce(true);

    pollyClientMock.on(StartSpeechSynthesisTaskCommand).resolvesOnce({
      SynthesisTask: { TaskId: 'mockTaskId' }
    });

    DatabaseService.prototype.saveTtsTask = mockSaveTtsTask;
    mockSaveTtsTask.mockResolvedValueOnce(true);

    await handler.articleReader(mockEvent as SNSEvent, {} as Context, null);

    expect(mockSaveArticle).toBeCalledTimes(1);
    expect(mockSaveTtsTask).toBeCalledTimes(1);
  });
});
