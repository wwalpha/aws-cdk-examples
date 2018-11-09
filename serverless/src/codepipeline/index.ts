import { StackProps } from '@aws-cdk/cdk';

export { default as CodeCommit } from './codecommit/codecommit';
export { default as CodeBuild } from './codebuild/codebuild';

export interface CodePipelineInput extends StackProps {
}

export interface CodePipelineOutput {
}
