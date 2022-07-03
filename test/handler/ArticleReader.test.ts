// eslint-disable-next-line import/no-unresolved
import { Context, SNSEvent } from 'aws-lambda';
import * as handler from '../../src/handler/ArticleReader';
import { ArticleExtractService } from '../../src/service/ArticleExtractService';

describe('Article Reader handler tests', () => {
  const mockRetrieveArticle = jest.fn();
  const mockEvent = {
    Records: [
      {
        Sns: {
          Message: 'mockUrl',
        },
      },
    ],
  };

  beforeEach(() => {
    mockRetrieveArticle.mockReset();
  });

  it('articleReader() does not throw an error when a successful extraction is done', async () => {
    ArticleExtractService.prototype.retrieveArticle = mockRetrieveArticle;
    mockRetrieveArticle.mockResolvedValueOnce({ text: 'mock article text' });

    await handler.articleReader(mockEvent as SNSEvent, {} as Context, null);
  });
});
