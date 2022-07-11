import { SynthesisTask } from '@aws-sdk/client-polly';

export class TtsTaskEntity {
  readonly engine: string;
  readonly taskId: string;
  readonly taskStatus: string;
  readonly taskStatusReason: string;
  readonly outputUri: string;
  readonly creationTime: string;
  readonly requestCharacters: number;
  readonly snsTopicArn: string;
  readonly lexiconNames: string[];
  readonly outputFormat: string;
  readonly sampleRate: string;
  readonly speechMarkTypes: string[];
  readonly textType: string;
  readonly voiceId: string;
  readonly languageCode: string;

  constructor(synthesisTask: SynthesisTask) {
    this.engine = synthesisTask.Engine;
    this.taskId = synthesisTask.TaskId;
    this.taskStatus = synthesisTask.TaskStatus;
    this.taskStatusReason = synthesisTask.TaskStatusReason;
    this.outputUri = synthesisTask.OutputUri;
    this.creationTime = synthesisTask.CreationTime?.toISOString();
    this.requestCharacters = synthesisTask.RequestCharacters;
    this.snsTopicArn = synthesisTask.SnsTopicArn;
    this.lexiconNames = synthesisTask.LexiconNames;
    this.outputFormat = synthesisTask.OutputFormat;
    this.sampleRate = synthesisTask.SampleRate;
    this.speechMarkTypes = synthesisTask.SpeechMarkTypes;
    this.textType = synthesisTask.TextType;
    this.voiceId = synthesisTask.VoiceId;
    this.languageCode = synthesisTask.LanguageCode;
  }
}
