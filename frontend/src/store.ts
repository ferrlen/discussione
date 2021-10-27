import { createStore } from "vuex";

export interface State {
  topic: Object;
}

export default createStore<State>({
  state() {
    return {
      topic: {},
    };
  },

  mutations: {
    createTopic(state, topic) {
      state.topic = topic;
    },
  },
});
