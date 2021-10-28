<template>
  <div>
    <h4 @click="open = !open">
      Children <span><img :class="{ 'open-caret': open }" src="/public/caret-down.png" /> </span>
    </h4>
    <div v-show="open" class="branches">
      <div v-for="(n, idx) in branches" class="branch" :key="idx">
        <TreeViewNode :node="n" />
      </div>
    </div>
  </div>
</template>
<script>
import TreeViewNode from "@/components/tree_view/TreeViewNode.vue";

export default {
  name: "TreeViewBranches",
  props: ["branches"],
  data() {
    return {
      open: false,
    };
  },
  components: {
    TreeViewNode,
  },
};
</script>
<style scoped>
h4 {
  margin-top: 0;
  cursor: pointer;
  text-align: left;
}
.branches {
  padding-left: 25px;
}
img {
  transition: all 0.2s;
  transform: rotate(-90deg);
  height: 10px;
}
img.open-caret {
  transform: rotate(0);
}
</style>
