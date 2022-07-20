/* eslint-disable no-await-in-loop */
// eslint-disable-next-line import/no-unresolved
import { TodoistApi } from '@doist/todoist-api-typescript';
// eslint-disable-next-line import/no-unresolved
import { SNSEvent, SNSHandler } from 'aws-lambda';
import { TtsResultEvent } from '../model/TtsResultEvent';
import { DatabaseService } from '../service/DatabaseService';

const dbService = new DatabaseService(process.env.ARTICLE_TABLE_NAME);
const extractTodoIdRegEx = /todoId-([a-zA-Z-0-9]*)/;
const todoistApi = new TodoistApi(process.env.TODOIST_API_TOKEN);

export const receiveTtsResult: SNSHandler = async (event: SNSEvent) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const record of event.Records) {
    console.log(`Event received: ${record.Sns.Subject}`);

    const ttsResult: TtsResultEvent = JSON.parse(record.Sns.Message);
    const dbSaveResult: boolean = await saveTtsResult(ttsResult);

    console.log(`Save of TTS result to database was: ${dbSaveResult}`);

    if (dbSaveResult) {
      const updateTodoistResult: boolean = await updateTodoist(ttsResult);

      console.log(`Todoist update result was: ${updateTodoistResult}`);
    }
  }
};

const saveTtsResult = async (ttsResult: TtsResultEvent): Promise<boolean> => {
  let saveResult = false;
  const todoId = extractTodoId(ttsResult);

  if (todoId) {
    console.debug(`todoId found: ${todoId}, calling database save for ${JSON.stringify(ttsResult)}`);
    saveResult = await dbService.saveTtsResult(todoId, ttsResult);
  } else {
    console.error(`todoId not found in TTS result event: ${JSON.stringify(ttsResult)}`);
  }

  return saveResult;
};

const extractTodoId = (ttsResult: TtsResultEvent): string => {
  let todoId = null;
  const { outputUri } = ttsResult;
  const todoIdRegExMatch: RegExpMatchArray = outputUri.match(extractTodoIdRegEx);

  console.debug(`todoId regex parsing result: ${todoIdRegExMatch}`);

  if (todoIdRegExMatch.length > 1) {
    // eslint-disable-next-line prefer-destructuring
    todoId = todoIdRegExMatch[1];
  }

  return todoId;
};

const updateTodoist = async (ttsResult: TtsResultEvent): Promise<boolean> => {
  const todoId = extractTodoId(ttsResult);
  const articleLink = `${process.env.ARTICLE_BASE_URL}?todoId=${todoId}&ref=${ttsResult.taskId}`;
  const commentText = `[Listen to article](${encodeURI(articleLink)})`;
  let apiResult = false;

  await todoistApi
    .addComment({
      taskId: +todoId,
      content: commentText,
    })
    .then(comment => {
      console.log(`Todoist comment was successful: ${comment}`);
      apiResult = true;
    })
    .catch(error => {
      console.error(`Todoist comment was unsuccessful: ${error}`);
      apiResult = false;
    });

  return apiResult;
};
