import {
  OutputFormat,
  PollyClient,
  StartSpeechSynthesisTaskCommand,
  StartSpeechSynthesisTaskCommandOutput,
  VoiceId,
} from '@aws-sdk/client-polly';
// eslint-disable-next-line import/no-unresolved
import { SNSEvent, SNSHandler } from 'aws-lambda';
import { ArticleReaderEvent } from '../model/ArticleReaderEvent';
import { Article, ArticleExtractService } from '../service/ArticleExtractService';
import { DatabaseService } from '../service/DatabaseService';

const articleExtractService = new ArticleExtractService(process.env.EXTRACT_API_HOST, process.env.EXTRACT_API_KEY);
const dbService = new DatabaseService(process.env.ARTICLE_TABLE_NAME);
const pollyClient = new PollyClient({});
const defaultVoiceId: VoiceId = 'Joanna';

export const articleReader: SNSHandler = async (event: SNSEvent) => {
  const articleReaderEvent: ArticleReaderEvent = JSON.parse(event.Records[0].Sns.Message);
  const { todoId } = articleReaderEvent;

  console.log(`Event received: ${event}`);

  const article: Article = await articleExtractService.retrieveArticle(articleReaderEvent.articleUrl);

  console.log(`Article result: ${JSON.stringify(article)}`);

  if (article) {
    let dbSuccess = await dbService.saveArticle(todoId, article);

    console.log(`The database saveArticle result was: ${dbSuccess}`);

    const pollySendStatus: StartSpeechSynthesisTaskCommandOutput = await sendArticleToPolly(todoId, article);

    if (pollySendStatus?.SynthesisTask) {
      console.log(`Saving Polly SynthesisTask to database: ${JSON.stringify(pollySendStatus.SynthesisTask)}`);
      dbSuccess = await dbService.saveTtsTask(todoId, pollySendStatus.SynthesisTask);
      console.log(`The database saveTtsTask result was: ${dbSuccess}`);
    }
  }
};

const sendArticleToPolly = async (todoId: string, article: Article): Promise<StartSpeechSynthesisTaskCommandOutput> => {
  return pollyClient.send(
    new StartSpeechSynthesisTaskCommand({
      OutputFormat: OutputFormat.MP3,
      OutputS3BucketName: process.env.TTS_RESULT_BUCKET_NAME,
      OutputS3KeyPrefix: `todo-id-${todoId}/`,
      SnsTopicArn: process.env.TTS_RESULT_TOPIC_ARN,
      Text: article.text,
      VoiceId: defaultVoiceId,
    })
  );
};
