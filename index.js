const Producer = require("./producer");

//
// Class manages a kafka connection and produces kafka messages based on
// Volante events.
//
module.exports = {
  name: "VolanteKafka",
  events: {
    "VolanteKafka.message"(topic, msg) {
      this.topic = topic;
      this.publish(msg);
    },
  },
  init() {
    if (this.configProps) {
      this.$log("attempting to initialize using config props");
      this.initialize(this.host, this.port);
    }
  },
  done() {
    Producer.done();
  },
  props: {
    host: "127.0.0.1",
    port: 27017,
    topic: "",
    kafkaOptions: {},
  },
  methods: {
    initialize(host, port) {
      Producer.initialize(host + ":" + port);
    },
    publish(msg) {
      Producer.publish(this.topic, msg);
    },
  },
};
