import { CommonProps } from '@utils';

// export { default as ImageToWord } from './image-to-word';
// export { default as AddNewWords } from './add-new-words';
// export { default as WordToSpeech } from './word-to-speech';
// export { default as StudyHistory } from './study-history';
// export { default as StudySet } from './study-set';

export const getHandler = (props: LambdaInput, functionName: string, handler: string): string => {
  if (props.envType === 'dev') {
    return `${functionName}/app.handler`;
  }

  return handler;
};

export interface LambdaInput extends CommonProps {
}

export interface LambdaOutput {
  // Lambda FunctionArn
  [key: string]: Function;
}
