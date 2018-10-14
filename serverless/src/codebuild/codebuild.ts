import { Construct } from '@aws-cdk/cdk';
import { CommonProps } from '../utils';
import { CodeBuildRole, Project } from '.';

export default (parent: Construct, props: CodeBuildInput): CodeBuildOutput => {

  const role = CodeBuildRole(parent, props);

  Project(parent, props, role);

  const ret: CodeBuildOutput = {
  };

  return ret;
};

export interface CodeBuildInput extends CommonProps {
}

export interface CodeBuildOutput {
}
