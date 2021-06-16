<template>
  <div>
    <p>这里是一级页面B</p>
    <button @click.stop="$emit('switch', { target: 'TwoB', index: 0 })">进入二级页面B</button>
    <button @click.stop="$emit('switch', { target: 'TwoC', index: 1 })">进入二级页面C</button>
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
