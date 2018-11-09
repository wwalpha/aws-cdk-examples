import { Stack, App } from '@aws-cdk/cdk';
import { Pipeline } from '@aws-cdk/aws-codepipeline';
import { CodeCommit, CodeBuild, CodePipelineOutput, CodePipelineInput } from '.';
import { getProjectName } from '@const';

export default class CodePipelineStack extends Stack {
  public readonly output: CodePipelineOutput;

  constructor(parent: App, name: string, props: CodePipelineInput) {
    super(parent, name, props);

    // Repository
    const repo = CodeCommit(this);

    const project = CodeBuild(this, {
      ...props,
      codeCommit: repo,
    });

    // Pipeline
    const pipeline = new Pipeline(this, 'CodePipeline', {
      pipelineName: getProjectName(),
    });

    const sourceStage = pipeline.addStage('Source');
    // add to pipe line
    repo.addToPipeline(sourceStage, 'codecommit');

    const buildStage = pipeline.addStage('Build');
    project.addBuildToPipeline(buildStage, 'codebuild');
  }
}
