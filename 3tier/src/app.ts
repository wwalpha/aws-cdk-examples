import { App } from '@aws-cdk/cdk';
import { getResourceName } from '@const';
import WebStack from '@web';
import AppStack from '@app';
import DBStack from '@db';
import { CloudFrontStack } from '@cloudfront';

class RootApp extends App {
  constructor() {
    super();

    const web = new WebStack(this, getResourceName('Web'));

    const app = new AppStack(this, getResourceName('App'), {
      vpc: web.outputs.vpc,
      webSg: web.outputs.webSg,
    });

    new DBStack(this, getResourceName('DB'), {
      vpc: web.outputs.vpc,
      appSg: app.outputs.appSg,
    });

    new CloudFrontStack(this, getResourceName('CDN'), {
      dnsName: web.outputs.dnsName,
    });
  }
}

new RootApp().run();
