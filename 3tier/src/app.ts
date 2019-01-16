import { App } from '@aws-cdk/cdk';
import { getResourceName } from '@const';
import NetworkStack from '@network';
import DBStack from '@db';
import AutoScalingStack from '@asg';

class RootApp extends App {
  constructor() {
    super();

    const network = new NetworkStack(this, getResourceName('Network'));

    const db = new DBStack(this, getResourceName('DB'), {
      vpc: network.outputs.vpc,
    });

    new AutoScalingStack(this, getResourceName('AutoScaling'), {
      dbEndpoint: db.outputs.endpoint,
      dbSecurityGroup: db.outputs.dbSecurityGroup,
      vpc: network.outputs.vpc,
    });

    // new CloudFrontStack(this, getResourceName('CDN'), {
    //   dnsName: web.outputs.dnsName,
    // });
  }
}

new RootApp().run();
