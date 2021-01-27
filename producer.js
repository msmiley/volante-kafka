const kafka = require("kafka-node");

module.exports = {
  props: {
    client: null,
    producer: null,
  },
  initialize(url) {
    try {
      const Producer = kafka.Producer;
      this.client = new kafka.KafkaClient({
        kafkaHost: url,
      }); // defaults to 'localhost:9092'
      this.producer = new Producer(this.client);

      // First wait for the producer to be initialized
      this.producer.on("ready", () => {
        console.log("ready to send kafka message");
      });

      this.producer.on("error", (err) => {
        console.log("error", err);
      });
    } catch (e) {
      console.error("error initializing kafka-node", e);
    }
  },
  publish(topic, message) {
    // Update metadata for the topic we'd like to publish to
    this.client.refreshMetadata([topic], (err) => {
      if (err) {
        console.log(err);
        throw err;
      }

      this.producer.send([{ topic, messages: [message] }], (err, result) => {
        console.log(err || result);
      });
    });
  },
  done() {
    if (this.producer) {
      this.producer.close();
    }
  },
};
