import { Construct } from '@aws-cdk/cdk';
import { EventRule } from '@aws-cdk/aws-events';
import { FunctionRef } from '@aws-cdk/aws-lambda';

export default (parent: Construct, func: FunctionRef) => {

  const start = new EventRule(parent, 'StartRule', {
    enabled: true,
    ruleName: 'EC2-Start',
    scheduleExpression: '0 0 ? * MON-FRI *',
  });

  start.addTarget(func, {
    jsonTemplate: JSON.stringify({
      action: 'start',
    }),
  });

  const stop = new EventRule(parent, 'StopRule', {
    enabled: true,
    ruleName: 'EC2-Stop',
    targets: [func],
    scheduleExpression: '0/60 12-15 ? * * *',
  });

  stop.addTarget(func, {
    jsonTemplate: JSON.stringify({
      action: 'stop',
    }),
  });
};
