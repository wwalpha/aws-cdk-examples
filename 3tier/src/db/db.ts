import { Stack, App } from '@aws-cdk/cdk';
import { TcpPort, VpcNetwork, SecurityGroup } from '@aws-cdk/aws-ec2';
import { CfnDBInstance, CfnDBSecurityGroup, CfnDBSubnetGroup } from '@aws-cdk/aws-rds';
import { getResourceName } from '@const';
import { DBStackProps, DBProps } from '@db';

export default class DBStack extends Stack {

  public readonly outputs: DBProps;

  constructor(parent?: App, name?: string, props?: DBStackProps) {
    super(parent, name, props);

    if (!props) return;

    // Cross Stack Import
    const vpc = VpcNetwork.import(this, 'vpc', props.vpc);
    const appSg = SecurityGroup.import(this, 'appSg', props.appSg);
    const dbSg = SecurityGroup.import(this, 'dbSg', props.dbSg);

    // DB Security Group
    dbSg.addIngressRule(appSg, new TcpPort(5432));

    const cfnSg = new CfnDBSecurityGroup(this, 'cfnDBSg', {
      ec2VpcId: vpc.vpcId,
      dbSecurityGroupIngress: [{
        ec2SecurityGroupId: dbSg.securityGroupId,
      }],
      groupDescription: 'db security group',
    });

    const subnetIds = vpc.isolatedSubnets
      .filter(item => item.node.id.startsWith('db'))
      .map(item => item.subnetId);

    const cfnSubnet = new CfnDBSubnetGroup(this, 'cfnSubnet', {
      dbSubnetGroupName: getResourceName('dbSubnet'),
      subnetIds,
      dbSubnetGroupDescription: 'DB Subnet Group',
    });

    // DatabaseCluster
    const db = new CfnDBInstance(this, 'RDS', {
      allowMajorVersionUpgrade: false,
      autoMinorVersionUpgrade: false,
      engine: 'postgres',
      engineVersion: '10.4',
      dbInstanceClass: 'db.t2.micro',
      dbInstanceIdentifier: getResourceName('postgres'),
      dbName: 'postgres',
      masterUsername: 'wwalpha',
      masterUserPassword: 'session10',
      allocatedStorage: '20',
      dbSecurityGroups: [cfnSg.ref],
      dbSubnetGroupName: cfnSubnet.dbSubnetGroupName,
      deletionProtection: false,
      multiAz: false,
      backupRetentionPeriod: '0',
    });

    this.outputs = {
      endpoint: db.dbInstanceEndpointAddress,
    };
  }
}
