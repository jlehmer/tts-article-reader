import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { DatabaseService } from '../../src/service/DatabaseService';

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

  it('saveArticle() returns fails when db throws an error', async () => {
    dbClientMock.on(PutCommand).rejectsOnce({});

    const dbResult = await dbService.saveArticle('mockTodoId', { text: 'mock article text' });

    expect(dbResult).toBe(false);
  });
});
