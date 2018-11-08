import { EC2 } from 'aws-sdk';
import { Callback } from 'aws-lambda';

const ec2 = new EC2();

export const handler = (event: any, _: any, callback: Callback) => {
  // EC2起動
  if (event.action === 'start') {
    start()
      .then(() => callback(null, 'Instances Started...'))
      .catch((err) => {
        console.log(err);
        callback(err, null);
      });
  }
  // EC2停止
  if (event.action === 'stop') {
    stop()
      .then(() => callback(null, 'Instances Stoped...'))
      .catch((err) => {
        console.log(err);
        callback(err, null);
      });
  }
};

/** EC2停止 */
const stop = async () => {
  let instances: string[] = [];

  // 環境変数未設定の場合、全EC2が対象になります。
  if (process.env.STOP_INSTANCES) {
    instances = (process.env.STOP_INSTANCES as string).split(',');
  } else {
    instances = await findTarget(16);
  }

  // 停止対象あり
  if (instances.length > 0) {
    await ec2.stopInstances({
      InstanceIds: instances,
      Force: true,
    }).promise();
  }
};

/** EC2起動 */
const start = async () => {
  let instances: string[] = [];

  // 環境変数未設定の場合、全EC2が対象になります。
  if (process.env.START_INSTANCES) {
    instances = (process.env.START_INSTANCES as string).split(',');
  } else {
    instances = await findTarget(80);
  }

  // 起動対象あり
  if (instances.length > 0) {
    await ec2.startInstances({
      InstanceIds: instances,
    }).promise();
  }
};

const findTarget = async (status: number): Promise<string[]> => {
  const instances: string[] = [];
  const { Reservations: reservations } = await ec2.describeInstances().promise();

  if (!reservations) return instances;

  reservations.forEach((item) => {
    if (!item.Instances) return;

    item.Instances.forEach((instance) => {
      // 0 : pending
      // 16 : running
      // 32 : shutting-down
      // 48 : terminated
      // 64 : stopping
      // 80 : stopped
      if (!instance.State || !instance.InstanceId) return;

      if (instance.State.Code === status) {
        instances.push(instance.InstanceId);
      }
    });
  });

  return instances;
};
