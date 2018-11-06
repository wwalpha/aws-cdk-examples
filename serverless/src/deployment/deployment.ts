import { Stack, App } from '@aws-cdk/cdk';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';
import { DeploymentOutput, DeploymentInput } from '.';
import { Bucket } from '@aws-cdk/aws-s3';
import { prefix } from '@utils';

export default class DeploymentStack extends Stack {
  public readonly output: DeploymentOutput;

  constructor(parent: App, name: string, props: DeploymentInput) {
    super(parent, name, props);

    const bucket = new Bucket(this, 'Deployment-Bucket', {
      bucketName: `${prefix}-deployment`,
    });

    new BucketDeployment(this, 'DeployWebsite', {
      source: Source.asset('./website-dist'),
      destinationBucket: bucket,
      destinationKeyPrefix: 'web/static', // optional prefix in destination bucket
    });
  }
}
