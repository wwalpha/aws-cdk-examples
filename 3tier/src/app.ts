import { App } from '@aws-cdk/cdk';
import { getResourceName } from '@const';
import DBStack from '@db';
import NetworkStack from '@network';
import AutoScalingStack from '@asg';

class RootApp extends App {
  constructor() {
    super();

    const network = new NetworkStack(this, getResourceName('Network'));

    const db = new DBStack(this, getResourceName('DB'), {
      vpc: network.outputs.vpc,
      appSg: network.outputs.appSg,
      dbSg: network.outputs.dbSg,
    });

    new AutoScalingStack(this, getResourceName('AutoScaling'), {
      dbEndpoint: db.outputs.endpoint,
      vpc: network.outputs.vpc,
      appSg: network.outputs.appSg,
      webSg: network.outputs.webSg,
    });

    // const web = new WebStack(this, getResourceName('Web'));

    // const app = new AppStack(this, getResourceName('App'), {
    //   vpc: web.outputs.vpc,
    //   webSg: web.outputs.webSg,
    // });

    // new DBStack(this, getResourceName('DB'), {
    //   vpc: web.outputs.vpc,
    //   appSg: app.outputs.appSg,
    // });

    // new CloudFrontStack(this, getResourceName('CDN'), {
    //   dnsName: web.outputs.dnsName,
    // });
  }
}

new RootApp().run();
