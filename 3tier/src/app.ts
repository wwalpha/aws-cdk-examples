import { App } from '@aws-cdk/cdk';
import { getResourceName } from '@const';
import CloudFrontStack from './cloudfront/cloudfront';
import WebStack from '@web';
import AppStack from '@app';
import DBStack from '@db';
import RootStack from './root';

class RootApp extends App {
  constructor() {
    super();

    const root = new RootStack(this, getResourceName('Root'));

    const web = new WebStack(this, getResourceName('Web'), {
      vpc: root.outputs.vpc,
    });

    const app = new AppStack(this, getResourceName('App'), {
      vpc: root.outputs.vpc,
      webSg: web.outputs.webSg,
    });

    new DBStack(this, getResourceName('DB'), {
      vpc: root.outputs.vpc,
      appSg: app.outputs.appSg,
    });

    new CloudFrontStack(this, getResourceName('CDN'), {
      dnsName: web.outputs.dnsName,
    });
  }
}

new RootApp().run();
