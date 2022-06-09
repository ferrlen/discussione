<template>
  <div class="tree-node">
    <TreeViewNodeDetails :author="node.author" :content="node.content" :id="node.id" />
    <TreeViewBranches v-if="node.branches.length" :branches="node.branches" />
  </div>
</template>
<script>
import { defineAsyncComponent } from "vue";
import TreeViewNodeDetails from "@/components/tree_view/TreeViewNodeDetails.vue";

export default {
  name: "TreeViewNode",
  props: ["node"],
  components: {
    TreeViewNodeDetails,
    // Register local component Asynchronously to prevent circular dependency isssue due to recursion
    // For more details see here: https://vuejs.org/v2/guide/components-edge-cases.html#Circular-References-Between-Components
    // And Here https://v3.vuejs.org/guide/component-dynamic-async.html#async-components
    TreeViewBranches: defineAsyncComponent(() => import("./TreeViewBranches.vue")),
  },
};
</script>
