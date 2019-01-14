import { Stack, App, StackProps } from '@aws-cdk/cdk';
import { NetworkProps, VpcNetwork } from '@network';
import { createSecurityGroup } from '@utils';
import { getResourceName } from '@const';

export default class NetworkStack extends Stack {

  public readonly outputs: NetworkProps;

  constructor(parent?: App, name?: string, props?: StackProps) {
    super(parent, name, props);

    const vpc = VpcNetwork(this);
    const webSg = createSecurityGroup(this, vpc, getResourceName('webSg'));
    const appSg = createSecurityGroup(this, vpc, getResourceName('appSg'));
    const dbSg = createSecurityGroup(this, vpc, getResourceName('dbSg'));

    this.outputs = {
      vpc: vpc.export(),
      webSg: webSg.export(),
      appSg: appSg.export(),
      dbSg: dbSg.export(),
    };
  }
}
