// eslint-disable-next-line import/no-unresolved
import { SNSEvent, SNSHandler } from 'aws-lambda';
import { TtsResultEvent } from '../model/TtsResultEvent';
import { DatabaseService } from '../service/DatabaseService';

const dbService = new DatabaseService(process.env.ARTICLE_TABLE_NAME);
const extractTodoIdRegEx = /todoId-([a-zA-Z-0-9]*)/;

export const receiveTtsResult: SNSHandler = async (event: SNSEvent) => {
  event.Records.forEach(async record => {
    console.log(`Event received: ${record.Sns.Subject}`);

    const ttsResult: TtsResultEvent = JSON.parse(record.Sns.Message);
    const dbSaveResult: boolean = await saveTtsResult(ttsResult);

    console.log(`Save of TTS result to database was: ${dbSaveResult}`);

    // send updates to Todoist
  });
};

const saveTtsResult = async (ttsResult: TtsResultEvent): Promise<boolean> => {
  let saveResult = false;
  const todoId = extractTodoId(ttsResult);

  if (todoId) {
    saveResult = await dbService.saveTtsResult(todoId, ttsResult);
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
