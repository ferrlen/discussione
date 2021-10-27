<template>
  <div>
    <h1>Title: {{ title }}</h1>
    <span id="title-edit">🖉 {{ count }}</span>
    <TreeView />
    <BlockView />
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from "vue";
import TreeView from "@/components/tree_view/TreeView.vue";
import BlockView from "@/components/block_view/BlockView.vue";
import store from "@/store.ts";
import SampleTopicData from "@/sampleTopicData.json";

export default defineComponent({
  name: "Topic",
  components: {
    TreeView,
    BlockView,
  },
  setup() {
    const topic = SampleTopicData[2];

    (() => {
      store.commit("createTopic", topic);
    })();
    // const createOrderedSchema = (t) => {
    //   for (let i = 0; i < Object.keys(t.order.sections).length; i++) {

    //   }
    // }
    const cTopic = computed(() => store.state.topic);
    return {
      cTopic,
    };
  },
  computed: {
    title() {
      return this.cTopic.title;
    },
  },
});
</script>
