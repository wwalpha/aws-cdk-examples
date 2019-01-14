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
      vpc: root.props.vpc,
    });

    const app = new AppStack(this, getResourceName('App'), {
      vpc: root.props.vpc,
      webSg: web.props.webSg,
    });

    new DBStack(this, getResourceName('DB'), {
      vpc: root.props.vpc,
      appSg: app.props.appSg,
    });

    new CloudFrontStack(this, getResourceName('CDN'), {
      dnsName: web.props.dnsName,
    });
  }
}

new RootApp().run();
