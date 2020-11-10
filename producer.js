const utils = require('utils');
const config = utils.getConfig();
const kafka = require('kafka-node');

module.exports = {
  props: {
    client: null,
    producer: null,
  },
  initialize() {
   
  },
  publish(topic, message) {
    console.log(`entering publish: ${topic} - ${message}`);

    try {
      const Producer = kafka.Producer;
      this.client = new kafka.KafkaClient({
        kafkaHost: config.kafka.host + ':' + config.kafka.port,
      }); // defaults to 'localhost:9092'
      this.producer = new Producer(this.client);

      this.producer.on('error', (err) => {
        console.log('error', err);
      });
    } catch (e) {
      console.error('error initializing kafka-node', e);
    }
    
    const admin = new kafka.Admin(this.client);
    admin.listTopics((err, res) => {
      //console.log(JSON.stringify(res));
      if(err){
        console.log(err);
      }

      if(res && res['metadata']){
        if(!(topic in res['metadata'])){
          console.log(`Creating new topic: ${topic}`);
          this.client.createTopics([{ topic : topic, partitions: 1, replicationFactor: 1}], (err,res) =>{
            console.log(err || res);
          })
        }
      }
    });

    // First wait for the producer to be initialized
    this.producer.on('ready', () => {
      console.log('ready to send kafka message');
      // Update metadata for the topic we'd like to publish to
      this.client.refreshMetadata([topic], (err) => {
        if (err) {
          console.log(err);
          throw err;
        }

        console.log(`Sending message to ${topic}: ${message}`);
        this.producer.send([{ topic, messages: [message] }], (err, result) => {
          console.log(err || result);
        });
      });
    });
  },
  done() {
    if (this.producer) {
      this.producer.close();
    }
  },
};
