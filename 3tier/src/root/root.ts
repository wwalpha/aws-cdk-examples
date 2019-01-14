import { Stack, App, StackProps } from '@aws-cdk/cdk';
import { WebProps, VpcNetwork } from '.';

export default class RootStack extends Stack {

  public readonly props: WebProps;

  constructor(parent?: App, name?: string, props?: StackProps) {
    super(parent, name, props);

    this.props = {
      vpc: VpcNetwork(this).export(),
    };
  }
}
