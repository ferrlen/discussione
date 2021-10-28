import { createStore } from "vuex";

export interface State {
  topicTree: Array<any>;
}

export default createStore<State>({
  state() {
    return {
      topicTree: [],
    };
  },

  mutations: {
    createTopicTree(state, tree) {
      state.topicTree = tree;
    },
  },
});
