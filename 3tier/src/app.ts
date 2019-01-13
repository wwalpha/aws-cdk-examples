import { App } from '@aws-cdk/cdk';
import { getResourceName } from '@const';
import CloudFrontStack from './cloudfront/cloudfront';
import WebStack from '@web';
import AppStack from '@app';
import DBStack from '@db';

class RootApp extends App {
  constructor() {
    super();

    const web = new WebStack(this, getResourceName('Web'));

    const app = new AppStack(this, getResourceName('App'), {
      vpc: web.props.vpc,
      webSg: web.props.webSg,
    });

    new DBStack(this, getResourceName('DB'), {
      vpc: web.props.vpc,
      appSg: app.props.appSg,
    });

    new CloudFrontStack(this, getResourceName('CDN'), {
      dnsName: web.props.dnsName,
    });
  }
}

new RootApp().run();
