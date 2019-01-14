import { Stack, App } from '@aws-cdk/cdk';
import { TcpPort, VpcNetwork, SecurityGroup } from '@aws-cdk/aws-ec2';
import { CfnDBInstance, CfnDBSecurityGroup } from '@aws-cdk/aws-rds';
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

    const dbSg = createSecurityGroup(this, vpc, getResourceName('db'));
    dbSg.addIngressRule(appSg, new TcpPort(5432));

    const cfnSg = new CfnDBSecurityGroup(this, 'cfnDBSg', {
      dbSecurityGroupIngress: [{
        ec2SecurityGroupId: dbSg.securityGroupId,
      }],
      groupDescription: 'db security group',
    });
    // const dbSg = new CfnDBSecurityGroup(this, 'dbSecurityGroup', {
    //   ec2VpcId: vpc.vpcId,
    //   dbSecurityGroupIngress: [
    //     {
    //       ec2SecurityGroupId: appSg.securityGroupId,
    //     },
    //   ],
    //   groupDescription: 'db security group',
    // });
    console.log(dbSg);

    // DatabaseCluster
    new CfnDBInstance(this, 'RDS', {
      allowMajorVersionUpgrade: false,
      autoMinorVersionUpgrade: false,
      engine: 'PostgreSQL',
      dbInstanceClass: 'db.t2.micro',
      dbName: getResourceName('test'),
      masterUsername: 'wwalpha',
      masterUserPassword: 'session10',
      allocatedStorage: '5',
      dbSecurityGroups: [cfnSg.ref],
    });
  }
}
