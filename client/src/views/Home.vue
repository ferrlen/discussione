<template>
  <div id="home">
    <div>TODO menu</div>
    <h1 style="padding: 0; margin: 0;">Welcome to Discussione!</h1>
    <div>Please input your login name:</div>
    <input v-model="username" style="width: 222px;" placeholder="Or leave it blank to be anonymous">
    <div>And now either:</div>
    <button @click="newTopic()" style="padding: 1em;">Start a new topic</button>
    <div v-if="topics.length">Or pick one of the topics below. These are the current projects:
      <nav>
        <router-link v-for="(obj, i) of topics" :key="i" :to="`/topic/${obj.slug}`">
          {{ obj.title + ' (click me)'}}
        </router-link>
      </nav>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Home',
  data() {
    return {
      username: '',
      topics: [],
    };
  },
  methods: {
    newTopic() {
      return 1;
    },
  },
};
</script>
