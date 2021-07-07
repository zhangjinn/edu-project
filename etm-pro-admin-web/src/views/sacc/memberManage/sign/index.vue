<template>
  <div class="sign">
    <course />
  </div>
</template>
<script>
import course from './course'
export default {
  components: {
    course
  }
}
</script>

<style scoped lang="scss">
.sign {
  @include bgc_white();
  height: calc(100vh - 154px);
  overflow-y: auto;
}
</style>
