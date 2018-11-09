import { Construct } from '@aws-cdk/cdk';
import { Role } from '@aws-cdk/aws-iam';
import { Project, ComputeType, LinuxBuildImage, NoBuildArtifacts } from '@aws-cdk/aws-codebuild';
import { CodeBuildInput } from '.';
import { getProjectName } from '@const';

export default (parent: Construct, _: CodeBuildInput, role: Role) => new Project(
  parent,
  'ProjectResource',
  {
    projectName: getProjectName(),
    environment: {
      computeType: ComputeType.Small,
      buildImage: LinuxBuildImage.UBUNTU_14_04_NODEJS_8_11_0,
    },
    role,
    artifacts: new NoBuildArtifacts(),
  },
);
