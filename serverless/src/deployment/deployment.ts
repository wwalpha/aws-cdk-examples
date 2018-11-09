import { Stack, App } from '@aws-cdk/cdk';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';
import { DeploymentOutput, DeploymentInput } from '.';
import { Bucket } from '@aws-cdk/aws-s3';
import { getBucketName } from '@const';

export default class DeploymentStack extends Stack {
  public readonly output: DeploymentOutput;

  constructor(parent: App, name: string, props: DeploymentInput) {
    super(parent, name, props);

    const bucket = new Bucket(this, 'Deployment-Bucket', {
      bucketName: getBucketName('deploymennt'),
    });

    new BucketDeployment(this, 'DeployWebsite', {
      source: Source.asset('./website-dist'),
      destinationBucket: bucket,
      destinationKeyPrefix: 'web/static', // optional prefix in destination bucket
    });
  }
}
