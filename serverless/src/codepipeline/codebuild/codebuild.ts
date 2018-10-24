import { Construct } from '@aws-cdk/cdk';
import { CodeBuildRole, RepoProject, CodeBuildInput } from '.';
import { Project } from '@aws-cdk/aws-codebuild';

export default (parent: Construct, props: CodeBuildInput): Project => {
  const role = CodeBuildRole(parent, props);

  return RepoProject(parent, props, role);
};
