<template>
  <div class="branch"></div>
</template>
<script>
import TreeViewItem from "@/components/tree_view/TreeViewItem.vue";

export default {
  name: "TreeViewItem",
  setup() {},
  props: ["item"],
  component: {
    TreeViewItem,
  },
};
</script>
