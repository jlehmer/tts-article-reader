export interface TtsResultEvent {
  taskId: string;
  taskStatus: string;
  outputUri: string;
  creationTime: string;
  requestCharacters: number;
  snsTopicArn?: string;
  outputFormat: string;
  textType: string;
  voiceId: string;
}
