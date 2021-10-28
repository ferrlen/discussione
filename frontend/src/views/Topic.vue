<template>
  <div>
    <h1>Title: {{ title }}</h1>
    <span id="title-edit">🖉</span>
    <TreeView :tree="globalTopicTree" />
    <BlockView />
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from "vue";
import TreeView from "@/components/tree_view/TreeView.vue";
import BlockView from "@/components/block_view/BlockView.vue";
import store from "@/store.ts";
import SampleTopicData from "@/sampleTopicData.json";
import topicHelper from "@/lib/topicHelper.js";

export default defineComponent({
  name: "Topic",
  components: {
    TreeView,
    BlockView,
  },
  setup() {
    // TODO: Use real data instead of Sample data for templating purposes
    const topic = SampleTopicData[2];
    const tree = topicHelper.buildTopicTree(topic);

    (() => {
      store.commit("createTopicTree", tree);
    })();

    const globalTopicTree = computed(() => store.state.topicTree);
    return {
      topic,
      globalTopicTree,
    };
  },
  computed: {
    title() {
      return this.topic.title;
    },
  },
});
</script>
<style scoped>
div {
  text-align: left;
}
</style>
