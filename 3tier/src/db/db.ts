import { Stack, App } from '@aws-cdk/cdk';
import { TcpPort, VpcNetwork, SecurityGroup } from '@aws-cdk/aws-ec2';
import { getResourceName } from '@const';
import { createSecurityGroup } from '@utils';
import { DBStackProps } from '@db';

export default class DBStack extends Stack {

  constructor(parent?: App, name?: string, props?: DBStackProps) {
    super(parent, name, props);

    if (!props) return;

    // VPC作成
    const vpc = VpcNetwork.import(this, 'vpc', props.vpc);

    const appSg = SecurityGroup.import(this, 'appSg', props.appSg);

    // database
    const dbSg = createSecurityGroup(this, vpc, getResourceName('db'));
    dbSg.addIngressRule(appSg, new TcpPort(5432));

    // DatabaseCluster
    // new CfnDBInstance(this, 'rds', {
    //   dbSecurityGroups: dbSg,
    //   allowMajorVersionUpgrade: false,
    //   autoMinorVersionUpgrade: false,
    //   engine: 'PostgreSQL',
    // });
  }
}
