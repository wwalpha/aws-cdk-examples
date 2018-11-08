import { Construct } from '@aws-cdk/cdk';
import { EventRule } from '@aws-cdk/aws-events';
import { FunctionRef } from '@aws-cdk/aws-lambda';
import { safeLoad } from 'js-yaml';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Rules } from '@cloudwatch';

const config: Rules = safeLoad(readFileSync(join('config.yml'), 'utf8'));

export default (parent: Construct, func: FunctionRef) => {

  if (config.Start) {
    const { Name, Description, Schedule } = config.Start;

    const start = new EventRule(parent, 'StartRule', {
      enabled: true,
      ruleName: Name,
      scheduleExpression: `cron(${Schedule})`,
      description: Description,
    });

    start.addTarget(func, {
      jsonTemplate: JSON.stringify({
        action: 'start',
      }),
    });
  }

  if (config.Stop) {
    const { Name, Description, Schedule } = config.Stop;

    const stop = new EventRule(parent, 'StopRule', {
      enabled: true,
      ruleName: Name,
      scheduleExpression: `cron(${Schedule})`,
      description: Description,
    });

    stop.addTarget(func, {
      jsonTemplate: JSON.stringify({
        action: 'stop',
      }),
    });
  }
};
