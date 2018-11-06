import { CommonProps } from '@utils';
import { Bucket } from '@aws-cdk/aws-s3';
import { Repository } from '@aws-cdk/aws-codecommit';

export { default as RepoProject } from './repoProject';
export { default as S3Project } from './s3Project';
export { default as CodeBuildRole } from './codebuildRole';

export interface CodeBuildInput extends CommonProps {
  bucket?: Bucket;
  codeCommit?: Repository;
}

export interface CodeBuildOutput {
}
