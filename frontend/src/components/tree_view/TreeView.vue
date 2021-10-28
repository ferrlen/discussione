<template>
  <div>
    <TreeViewOptions />
    <div v-for="(n, idx) in tree" class="level" :key="idx">
      <TreeViewNode :node="n" />
    </div>
  </div>
</template>
<script>
import TreeViewOptions from "@/components/tree_view/TreeViewOptions.vue";
import TreeViewNode from "@/components/tree_view/TreeViewNode.vue";

export default {
  name: "TreeView",
  props: ["tree"],
  components: {
    TreeViewOptions,
    TreeViewNode,
  },
};
</script>
