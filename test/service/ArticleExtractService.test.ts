// eslint-disable-next-line import/no-unresolved
import axios from 'axios';
import MockAdapter from "axios-mock-adapter";
import { ArticleExtractService } from "../../src/service/ArticleExtractService";

describe("Article extract service tests", () => {
  let extractService: ArticleExtractService;
  let mockAxios: MockAdapter;

  beforeAll(() => {
    mockAxios = new MockAdapter(axios);
  });

  beforeEach(() => {
    mockAxios.reset();
    extractService = new ArticleExtractService('mockApiHost', 'mockApiKey');
  });

  it("retrieveArticle() returns article when successful call to API", async () => {
    const mockExtractResponse = {
      article: {
        text: 'mock article text'
      }
    };

    mockAxios.onGet(`https://mockApiHost/v1.1/extract`).reply(200, mockExtractResponse);

    const article = await extractService.retrieveArticle('mockArticleUrl');

    expect(article).toMatchObject({ text: 'mock article text' });
  });

  it("retrieveArticle() returns null when call to API throws an error", async () => {
    mockAxios.onGet(`https://mockApiHost/v1.1/extract`).networkError();

    const article = await extractService.retrieveArticle('mockArticleUrl');

    expect(article).toBe(null);
  });
});
