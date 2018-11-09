import { Construct } from '@aws-cdk/cdk';
import { Repository } from '@aws-cdk/aws-codecommit';
import { getProjectName } from '@const';

export default (parent: Construct): Repository => {

  // Repository作成
  const repo = new Repository(parent, 'Repository', {
    repositoryName: getProjectName(),
  });

  return repo;
};
