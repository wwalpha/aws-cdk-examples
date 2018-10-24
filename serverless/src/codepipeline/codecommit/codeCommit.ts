import { Construct } from '@aws-cdk/cdk';
import { Repository } from '@aws-cdk/aws-codecommit';
import { CodeCommitInput } from '.';

export default (parent: Construct, props: CodeCommitInput): Repository => {

  // Repository作成
  const repo = new Repository(parent, 'Repository', {
    repositoryName: props.project,
  });

  return repo;
};
