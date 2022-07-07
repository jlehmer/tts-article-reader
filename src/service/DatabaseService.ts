import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { SynthesisTask } from '@aws-sdk/client-polly';
import { Article } from './ArticleExtractService';

export class DatabaseService {
  private dbClient: DynamoDBDocumentClient;

  constructor(private tableName: string) {
    this.dbClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
  }

  async saveArticle(todoId: string, article: Article): Promise<boolean> {
    const putCommand = new PutCommand({
      TableName: this.tableName,
      Item: {
        PK: `TODOID#${todoId}`,
        SK: 'article',
        todoId,
        ...article,
      },
    });

    try {
      const putResult = await this.dbClient.send(putCommand);

      console.log(`Successfully created article for todo (${todoId}): ${JSON.stringify(putResult)}`);

      return true;
    } catch (error) {
      console.error(`Failed to create article for todo (${todoId})`, error);

      return false;
    }
  }

  async saveTtsTask(todoId: string, ttsTask: SynthesisTask): Promise<boolean> {
    const putCommand = new PutCommand({
      TableName: this.tableName,
      Item: {
        PK: `TTSTASK#${ttsTask.TaskId}`,
        SK: `TTSTASK#${ttsTask.TaskId}`,
        todoId,
        ...ttsTask,
      },
      ConditionExpression: 'attribute_not_exists(PK)'
    });

    try {
      const putResult = await this.dbClient.send(putCommand);

      console.log(`Successfully created TTS task (${ttsTask.TaskId}) for todo (${todoId}): ${JSON.stringify(putResult)}`);

      return true;
    } catch (error) {
      console.error(`Failed to create TTS task (${ttsTask.TaskId}) for todo (${todoId})`, error);

      return false;
    }
  }
}
