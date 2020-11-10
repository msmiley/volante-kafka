const utils = require('utils');
const config = utils.getConfig();
const kafka = require('kafka-node');

module.exports = {
  props: {
    consumer: null,
  },

  initialize() {
    try {
      (Consumer = kafka.Consumer),
        (client = new kafka.KafkaClient({
          kafkaHost: config.kafka.host + ':' + config.kafka.port,
        })); // defaults to 'localhost:9092'
      consumer = new Consumer(client, [{ topic: 'test-topic', partition: 0 }], {
        autoCommit: false,
      });

      consumer.on('error', (err) => {
        console.log('error', err);
      });
    } catch (e) {
      console.error('error initializing kafka-node', e);
    }
  },
  subscribe(topic) {
    // First wait for the consumer to be initialized
    consumer.on('message', (message) => {
      console.log('consumed: ' + JSON.stringify(message));
    });
  },
  done() {
    if (this.consumer) {
      this.consumer.close();
    }
  },
};
