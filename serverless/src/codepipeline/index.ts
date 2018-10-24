import { CommonProps } from '../utils';

export { default as CodeCommit } from './codecommit/codecommit';
export { default as CodeBuild } from './codebuild/codebuild';

export interface CodePipelineInput extends CommonProps {
}

export interface CodePipelineOutput {
}
