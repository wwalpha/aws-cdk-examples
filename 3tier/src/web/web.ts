// import { Stack, App, Output, StackProps } from '@aws-cdk/cdk';
// import { TcpPort, AnyIPv4, SubnetType } from '@aws-cdk/aws-ec2';
// import { getResourceName } from '@const';
// import { WebProps, VpcNetwork } from '.';
// import { createSecurityGroup, creatAutoScalingWithELB } from '@utils';

// export default class WebStack extends Stack {

//   public readonly outputs: WebProps;

//   constructor(parent?: App, name?: string, props?: StackProps) {
//     super(parent, name, props);

//     const vpc = VpcNetwork(this);
//     // セキュリティグループ作成
//     // internet load blancer
//     const elbSg = createSecurityGroup(this, vpc, getResourceName('internet-sg'));
//     elbSg.addIngressRule(new AnyIPv4(), new TcpPort(80));

//     // internet LB + AutoScaling
//     const alb = creatAutoScalingWithELB(
//       this,
//       vpc,
//       elbSg,
//       {
//         vpcPlacement: {
//           subnetsToUse: SubnetType.Public,
//         },
//         elbName: getResourceName('internet'),
//         asgName: getResourceName('web-asg'),
//         ami: 'ami-0ae06ebad9afaa5af',
//         port: 80,
//         internetFacing: true,
//       });

//     // web
//     const webSg = createSecurityGroup(this, vpc, getResourceName('web'));
//     webSg.addIngressRule(elbSg, new TcpPort(80));

//     this.outputs = {
//       dnsName: new Output(this, 'DnsName', {
//         export: getResourceName('DNSName'),
//         value: alb.dnsName,
//       }).makeImportValue(),
//       vpc: vpc.export(),
//       webSg: webSg.export(),
//     };
//   }
// }
