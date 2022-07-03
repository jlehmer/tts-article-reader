// eslint-disable-next-line import/no-unresolved
import { SNSEvent, SNSHandler } from "aws-lambda";
import { Article, ArticleExtractService } from "../service/ArticleExtractService";

const articleExtractService = new ArticleExtractService(process.env.EXTRACT_API_HOST, process.env.EXTRACT_API_KEY);

export const articleReader: SNSHandler = async (event: SNSEvent) => {
  console.log(`Event received: ${event}`);

  const article: Article = await articleExtractService.retrieveArticle(event.Records[0].Sns.Message);

  console.log(`Article result: ${JSON.stringify(article)}`);
};
