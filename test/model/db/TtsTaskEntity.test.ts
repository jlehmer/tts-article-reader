import { SynthesisTask } from "@aws-sdk/client-polly";
import { TtsTaskEntity } from "../../../src/model/db/TtsTaskEntity";

describe('TtsTaskEntity tests', () => {
  it('retrieveArticle() returns article when successful call to API', async () => {
    const today = new Date();
    const expectedTtsTaskEntity = {
      engine: 'mockEngine',
      taskId: 'mockTaskId',
      taskStatus: 'mockTaskStatus',
      taskStatusReason: 'mockTaskStatusReason',
      outputUri: 'mockOutputUri',
      creationTime: today.toISOString(),
      requestCharacters: 1000,
      snsTopicArn: 'mockSnsTopicArn',
      lexiconNames: ['mockLexiconName1', 'mockLexiconName2'],
      outputFormat: 'mockOutputFormat',
      sampleRate: 'mockSampleRate',
      speechMarkTypes: ['mockSpeechMarkType1', 'mockSpeechMarkType2'],
      textType: 'mockTextType',
      voiceId: 'mockeVoiceId',
      languageCode: 'mockLanguageCode'
    }

    const mockSynthesisTask: SynthesisTask = {
      Engine: 'mockEngine',
      TaskId: 'mockTaskId',
      TaskStatus: 'mockTaskStatus',
      TaskStatusReason: 'mockTaskStatusReason',
      OutputUri: 'mockOutputUri',
      CreationTime: today,
      RequestCharacters: 1000,
      SnsTopicArn: 'mockSnsTopicArn',
      LexiconNames: ['mockLexiconName1', 'mockLexiconName2'],
      OutputFormat: 'mockOutputFormat',
      SampleRate: 'mockSampleRate',
      SpeechMarkTypes: ['mockSpeechMarkType1', 'mockSpeechMarkType2'],
      TextType: 'mockTextType',
      VoiceId: 'mockeVoiceId',
      LanguageCode: 'mockLanguageCode'
    }

    const newTtsTaskEntity = new TtsTaskEntity(mockSynthesisTask);

    expect(newTtsTaskEntity).toMatchObject(expectedTtsTaskEntity);
  });

});
