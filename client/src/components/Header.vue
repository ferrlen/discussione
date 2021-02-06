<template>
  <header>
    <nav id="topnav">
      <router-link to="/">Home</router-link>
      <router-link to="/FAQ">FAQ</router-link>
      <router-link to="/add-participant">Add participant</router-link>
      <router-link to="/comments">General comments</router-link>
      <router-link to="/#edit-css">Edit CSS</router-link>
      <a href="javascript:tools();">Tools &#128736;</a>
      <a href="javascript:void(0);" class="icon" onclick="menuOpen()">&#9776;</a>
    </nav>
  </header>
</template>
<script>
export default {
  name: 'Header',

};
</script>
