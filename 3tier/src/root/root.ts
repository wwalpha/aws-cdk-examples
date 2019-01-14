import { Stack, App, StackProps } from '@aws-cdk/cdk';
import { WebProps, VpcNetwork } from '.';

export default class RootStack extends Stack {

  public readonly outputs: WebProps;

  constructor(parent?: App, name?: string, props?: StackProps) {
    super(parent, name, props);

    this.outputs = {
      vpc: VpcNetwork(this).export(),
    };
  }
}
