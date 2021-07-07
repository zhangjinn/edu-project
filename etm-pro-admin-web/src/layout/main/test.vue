<template>
  <div class="test">
    {{ this.text }}
  </div>
</template>

<script>
export default {
  name: 'Test',
  props: {
    text: {
      type: String,
      default: '没有传过来啊'
    }
  }
}
</script>

<style scoped lang="scss">
.test {
  position: fixed;
  right: 0;
  bottom: 0;
}
</style>
