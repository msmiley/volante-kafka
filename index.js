const kafka = require("kafka-node");

//
// Class manages a kafka connection and produces kafka messages based on
// Volante events.
//
module.exports = {
  name: "VolanteKafka",
  events: {
    "VolanteKafka.publish"(topic, msg) {
      this.publish(...arguments);
    },
    "VolanteKafka.start"() {
      this.initialize();
    },
  },
  init() {
    if (this.configProps) {
      this.$log("attempting to initialize using config props");
      this.initialize();
    }
  },
  done() {
    if (this.producer) {
      this.producer.close();
    }
  },
  props: {
    host: "127.0.0.1",
    port: 27017,
  },
  data() {
    return {
      client: null,
      producer: null,
      publishedMessages: 0,
      refreshedTopics: [],
    };
  },
  methods: {
    initialize() {
      try {
        let kafkaHost = `${this.host}:${this.port}`;
        this.$log(`setting up client to ${kafkaHost}`);
        this.client = new kafka.KafkaClient({
          kafkaHost
        });
        this.producer = new kafka.Producer(this.client);

        // First wait for the producer to be initialized
        this.producer.on('ready', () => {
          this.$log('ready to send kafka messages');
        });

        this.producer.on('error', (err) => {
          this.$error(err);
        });
      } catch (e) {
        this.$error('error initializing kafka-node', e);
      }
    },
    publish(topic, msg, callback) {
      // this.$isDebug && this.$debug('publish', topic, msg);
      this.client.refreshMetadata([topic], (err) => {
        if (err) {
          this.$error(err);
        }

        this.producer.send([{ topic, messages: [msg] }], (err, result) => {
          if (err) {
            this.$error(err);
            callback && callback(err);
            return;
          }
          this.$isDebug && this.$debug(`published message to ${topic}`);
          this.publishedMessages++;
          callback && callback(null, this.publishedMessages);
        });
      });
    },
  },
};
