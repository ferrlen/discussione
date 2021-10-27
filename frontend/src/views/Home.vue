<template>
  <div id="home" >
    <div>TODO menu</div>
    <h1 style="padding: 0; margin: 0;">Welcome to Discussione!</h1>
    <div>Please input your login name:</div>
    <input v-model="username" style="width: 222px;" placeholder="Or leave it blank to be anonymous">
    <div class="form-group" :class="{ 'form-group--error': v$.newTopic.$error }">
      <button @click="createTopic" style="padding: 1em;">Start a new topic</button>
      <div>
        <input class="form__input"
          v-model="state.newTopic"
          style="width: 222px;"
          placeholder="New Topic Name">
          <div class="input-errors" v-for="error of v$.newTopic.$errors" :key="error.$uid">
            <span v-if="error.$validator == 'required'" class="error-msg">
              Topic Name is Required
            </span>
            <span v-else class="error-msg">{{ error.$message }}</span>
          </div>
      </div>

    </div>
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
import { reactive } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'Home',
  setup() {
    const state = reactive({
      newTopic: '',
    });
    const rules = {
      newTopic: {
        required,
      },
    };
    const v$ = useVuelidate(rules, state);
    return { state, v$ };
  },
  data() {
    return {
      username: '',
      topics: [],
    };
  },
  methods: {
    async createTopic() {
      const isFormCorrect = await this.v$.$validate();
      if (!isFormCorrect) return;
      this.$router.push({ path: `/topic/${this.state.newTopic}` });
    },
  },
};
</script>
