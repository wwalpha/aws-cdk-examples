import { Construct } from '@aws-cdk/cdk';
import { Role } from '@aws-cdk/aws-iam';
import { Project, ComputeType, LinuxBuildImage, NoBuildArtifacts } from '@aws-cdk/aws-codebuild';
import { prefix } from '@utils';
import { CodeBuildInput } from '.';

export default (parent: Construct, props: CodeBuildInput, role: Role) => new Project(
  parent,
  'ProjectResource',
  {
    projectName: `${prefix(props)}`,
    environment: {
      computeType: ComputeType.Small,
      buildImage: LinuxBuildImage.UBUNTU_14_04_NODEJS_8_11_0,
    },
    role,
    artifacts: new NoBuildArtifacts(),
  },
);
