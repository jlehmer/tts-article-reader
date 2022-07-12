import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { DatabaseService } from '../../src/service/DatabaseService';
import { TtsResultEvent } from '../../src/model/TtsResultEvent';

describe('Article extract service tests', () => {
  const dbClientMock = mockClient(DynamoDBDocumentClient);

  let dbService: DatabaseService;

  beforeEach(() => {
    dbClientMock.reset();
    dbService = new DatabaseService('mockTableName');
  });

  it('saveArticle() returns true when db write is successful', async () => {
    dbClientMock.on(PutCommand).resolvesOnce({});

    const dbResult = await dbService.saveArticle('mockTodoId', { text: 'mock article text' });

    expect(dbResult).toBe(true);
  });

  it('saveArticle() returns false when db throws an error', async () => {
    dbClientMock.on(PutCommand).rejectsOnce({});

    const dbResult = await dbService.saveArticle('mockTodoId', { text: 'mock article text' });

    expect(dbResult).toBe(false);
  });

  it('saveTtsTask() returns true when db write is successful', async () => {
    dbClientMock.on(PutCommand).resolvesOnce({});

    const dbResult = await dbService.saveTtsTask('mockTodoId', { TaskId: 'mockTaskId' });

    expect(dbResult).toBe(true);
  });

  it('saveTtsTask() returns false when db throws an error', async () => {
    dbClientMock.on(PutCommand).rejectsOnce({});

    const dbResult = await dbService.saveTtsTask('mockTodoId', { TaskId: 'mockTaskId' });

    expect(dbResult).toBe(false);
  });

  it('saveTtsResult() returns true when db write is successful', async () => {
    dbClientMock.on(PutCommand).resolvesOnce({});

    const dbResult = await dbService.saveTtsResult('mockTodoId', { taskId: 'mockTaskId' } as TtsResultEvent);

    expect(dbResult).toBe(true);
  });

  it('saveTtsTask() returns false when db throws an error', async () => {
    dbClientMock.on(PutCommand).rejectsOnce({});

    const dbResult = await dbService.saveTtsResult('mockTodoId', { taskId: 'mockTaskId' } as TtsResultEvent);

    expect(dbResult).toBe(false);
  });
});
