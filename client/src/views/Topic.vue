<template>
  <div>
    <h1>Title: <input v-model="topicTitle" /></h1><span @click="" id="title-edit">🖉</span>
    <TreeView />
    <BlockView />
  </div>
</template>
<script>
import TreeView from '@/components/hierarchyTreeView/TreeView.vue';
import BlockView from '@/components/hierarchyBlockView/BlockView.vue';

export default {
  name: 'Topic',
  components: {
    TreeView,
    BlockView
  },
  data() {
    return {
      topicTitle: "Topic's Title"
    }
  },
};
</script>