<template>
  <div>
    <p>这里是一级页面A</p>
    <button @click.stop="$emit('switch', 'TwoA')">进入二级页面A</button>
  </div>
</template>
<script>
export default {
  data() {
    return {
    }
  },
  computed:{
  },
  methods:{
  }
}
</script>

<style scoped>
</style>
