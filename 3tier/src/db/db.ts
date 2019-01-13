import { Stack, App } from '@aws-cdk/cdk';
import { TcpPort, VpcNetworkRef, SecurityGroupRef } from '@aws-cdk/aws-ec2';
import { getResourceName } from '@const';
import { SecurityGroup } from '@utils';
import { DBStackProps } from '@db';

export default class DBStack extends Stack {

  constructor(parent?: App, name?: string, props?: DBStackProps) {
    super(parent, name, props);

    if (!props) return;

    // VPC作成
    const vpc = VpcNetworkRef.import(this, 'vpc', props.vpc);
    const appSg = SecurityGroupRef.import(this, 'appSg', props.appSg);

    // database
    const dbSg = SecurityGroup(this, vpc, getResourceName('db'));
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
