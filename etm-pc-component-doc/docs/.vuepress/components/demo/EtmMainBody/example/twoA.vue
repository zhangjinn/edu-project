<template>
  <div>
    <p>这里是二级页面A</p>
    <button @click.stop="$emit('switch', 'ThreeA')">进入三级页面A</button>
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
