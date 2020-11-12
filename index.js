const Producer = require('./producer');

//
// Class manages a kafka connection and produces kafka messages based on
// Volante events.
//
module.exports = {
  name: 'VolanteKafka',
  events: {
    'VolanteKafka.message'(topic, msg) {
      this.topic = topic;
      this.publish(msg);
    },
  },
  init() {
    this.initialize();
  },
  done() {
    Producer.done();
  },
  props: {
    topic: '',
    kafkaOptions: {},
  },
  methods: {
    initialize() {
      Producer.initialize();
    },
    publish(msg) {
      Producer.publish(this.topic, msg);
    },
  },
};
