import { Stack, App, StackProps } from '@aws-cdk/cdk';
import { VpcNetwork, SecurityGroup, SgProps } from '@network';
import { VpcNetworkRefProps, TcpPort, AnyIPv4 } from '@aws-cdk/aws-ec2';

export default class NetworkStack extends Stack {

  public readonly vpc: VpcNetworkRefProps;
  public readonly sg: SgProps;

  constructor(parent?: App, name?: string, props?: StackProps) {
    super(parent, name, props);

    // VPC作成
    const vpc = VpcNetwork(this);

    // セキュリティグループ作成
    // internet load blancer
    const internetSg = SecurityGroup(this, vpc, 'internet-sg');
    internetSg.addIngressRule(new AnyIPv4(), new TcpPort(80));

    // web
    const webSg = SecurityGroup(this, vpc, 'web-sg');
    webSg.addIngressRule(internetSg, new TcpPort(80));

    // intenal load blancer
    const internalSg = SecurityGroup(this, vpc, 'internal-sg');
    internalSg.addIngressRule(new AnyIPv4(), new TcpPort(8080));

    // application
    const appSg = SecurityGroup(this, vpc, 'app-sg');
    appSg.addIngressRule(internalSg, new TcpPort(8080));

    // database
    const dbSg = SecurityGroup(this, vpc, 'db-sg');
    dbSg.addIngressRule(appSg, new TcpPort(5432));

    // export
    this.vpc = vpc.export();
    this.sg.internet = internetSg.export();
    this.sg.internal = internalSg.export();
    this.sg.web = webSg.export();
    this.sg.app = appSg.export();
    this.sg.db = dbSg.export();
  }
}
