import { CloudFrontOriginAccessIdentity, CloudFrontInput, BucketPolicy } from '.';
import { Stack, App } from '@aws-cdk/cdk';

export default class CloudFrontStack extends Stack {

  constructor(parent: App, name: string, props: CloudFrontInput) {
    super(parent, name, props);

    const identity = CloudFrontOriginAccessIdentity(this);

    BucketPolicy(this, props, identity.ref);

    // Distribution(this, props, identity.ref);
  }
}

