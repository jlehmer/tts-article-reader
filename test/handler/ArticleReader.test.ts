// eslint-disable-next-line import/no-unresolved
import { Context, SNSEvent } from 'aws-lambda';
import * as handler from '../../src/handler/ArticleReader';
import { ArticleExtractService } from '../../src/service/ArticleExtractService';
import { DatabaseService } from '../../src/service/DatabaseService';

describe('Article Reader handler tests', () => {
  const mockRetrieveArticle = jest.fn();
  const mockSaveArticle = jest.fn();
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
    mockRetrieveArticle.mockReset();
    mockSaveArticle.mockReset();
  });

  it('articleReader() does not throw an error when a successful extraction is done', async () => {
    ArticleExtractService.prototype.retrieveArticle = mockRetrieveArticle;
    mockRetrieveArticle.mockResolvedValueOnce({ text: 'mock article text' });

    DatabaseService.prototype.saveArticle = mockSaveArticle;
    mockSaveArticle.mockResolvedValueOnce(true);

    await handler.articleReader(mockEvent as SNSEvent, {} as Context, null);
  });
});
