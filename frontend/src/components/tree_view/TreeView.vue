<template>
  <div>
    <!-- <app-zoom-out-options></app-zoom-out-options> -->
    <!-- <template v-for="(itemInOrder, index) in $globalVars.order.sections">
      <app-details-component
        :detailsItem="{ itemInOrder, index, parentNr: '' }"
      ></app-details-component>
    </template> -->
    <TreeViewOptions />

    <div class="branch">
      <div v-for="(item, idx) in items" :key="idx">
        <TreeViewItem :branch="item" />
      </div>
    </div>
  </div>
</template>
<script>
import TreeViewOptions from "@/components/tree_view/TreeViewOptions.vue";
import TreeViewItem from "@/components/tree_view/TreeViewItem.vue";
import store from "@/store.ts";

export default {
  name: "TreeView",
  components: {
    TreeViewOptions,
    TreeViewItem,
  },
  computed: {
    items() {
      return store.state.topic.infos;
    },
  },
};
</script>
