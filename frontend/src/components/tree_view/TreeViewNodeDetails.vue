<template>
  <div class="node-details">
    <h4>Author: {{ author }}</h4>
    <h4>ID: {{ id }}</h4>
    <h4>
      <span>Content:</span>
      <div class="content" v-html="encoded"></div>
    </h4>
  </div>
</template>
<script>
import { ref } from "vue";
import util from "@/lib/util.js";

export default {
  name: "TreeViewNodeDetails",
  props: {
    author: String,
    content: String,
    id: String,
  },
  setup(props) {
    const encoded = ref("");
    encoded.value = util.decodeHTMLEntities(props.content);
    return { encoded };
  },
};
</script>
<style scoped>
.node-details {
  margin-top: 25px;
}
.content {
  font-size: 14px;
  font-weight: 400;
  padding-left: 30px;
}
h4 {
  text-align: left;
  margin: 0 auto;
}
</style>
