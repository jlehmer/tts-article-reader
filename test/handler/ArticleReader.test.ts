// eslint-disable-next-line import/no-unresolved
import { Context, SNSEvent } from "aws-lambda";
import * as handler from "../../src/handler/ArticleReader";

describe("Article Reader handler tests", () => {
  it("Mock test", async () => {
    await handler.articleReader({} as SNSEvent, {} as Context, null);
  });
});
