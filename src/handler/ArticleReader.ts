// eslint-disable-next-line import/no-unresolved
import { SNSEvent, SNSHandler } from 'aws-lambda';
import { ArticleReaderEvent } from '../model/ArticleReaderEvent';
import { Article, ArticleExtractService } from '../service/ArticleExtractService';
import { DatabaseService } from '../service/DatabaseService';

const articleExtractService = new ArticleExtractService(process.env.EXTRACT_API_HOST, process.env.EXTRACT_API_KEY);
const dbSevice = new DatabaseService(process.env.ARTICLE_TABLE_NAME);

export const articleReader: SNSHandler = async (event: SNSEvent) => {
  const articleReaderEvent: ArticleReaderEvent = JSON.parse(event.Records[0].Sns.Message);

  console.log(`Event received: ${event}`);

  const article: Article = await articleExtractService.retrieveArticle(articleReaderEvent.articleUrl);

  console.log(`Article result: ${JSON.stringify(article)}`);

  if (article) {
    const dbSuccess = dbSevice.saveArticle(articleReaderEvent.todoId, article);

    console.log(`The database result was: ${dbSuccess}`);
  }
};
