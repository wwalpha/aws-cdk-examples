import { Stack, App, StackProps } from '@aws-cdk/cdk';
import { VpcNetwork, SecurityGroup, SgProps } from '@network';
import { VpcNetworkRefProps, TcpPort, AnyIPv4 } from '@aws-cdk/aws-ec2';
import { getResourceName } from '@const';

export default class NetworkStack extends Stack {

  public readonly vpc: VpcNetworkRefProps;
  public readonly sg: SgProps;

  constructor(parent?: App, name?: string, props?: StackProps) {
    super(parent, name, props);

    // VPC作成
    const vpc = VpcNetwork(this);

    // セキュリティグループ作成
    // internet load blancer
    const internetSg = SecurityGroup(this, vpc, getResourceName('internet'));
    internetSg.addIngressRule(new AnyIPv4(), new TcpPort(80));

    // web
    const webSg = SecurityGroup(this, vpc, getResourceName('web'));
    webSg.addIngressRule(internetSg, new TcpPort(80));

    // intenal load blancer
    const internalSg = SecurityGroup(this, vpc, getResourceName('internal'));
    internalSg.addIngressRule(new AnyIPv4(), new TcpPort(8080));

    // application
    const appSg = SecurityGroup(this, vpc, getResourceName('app'));
    appSg.addIngressRule(internalSg, new TcpPort(8080));

    // database
    const dbSg = SecurityGroup(this, vpc, getResourceName('db'));
    dbSg.addIngressRule(appSg, new TcpPort(5432));

    // export
    this.vpc = vpc.export();
    this.sg = {
      internet: internetSg.export(),
      internal: internalSg.export(),
      web: webSg.export(),
      app: appSg.export(),
      db: dbSg.export(),
    };
  }
}
