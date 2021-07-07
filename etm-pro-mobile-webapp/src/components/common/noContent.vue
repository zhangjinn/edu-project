<template>
  <div class="noContent">
    <div class="errorImg">
      <img v-if="type === 'none'" src="../../assets/images/none.png">
      <img v-else-if="type === 'search'" src="../../assets/images/search.png">
      <img v-else-if="type === 'leave'" src="../../assets/images/noLeave.png">
      <img v-else-if="type === 'list'" src="../../assets/images/list.png">
      <img v-else src="../../assets/images/nobody.png">
    </div>
    <p class="textCenter">{{ message }}</p>
    <p class="textCenter">{{ warnText }}</p>
  </div>
</template>

<script>
export default {
  name: 'NoContent',
  props: {
    message: {
      type: String,
      default() {
        return null
      }
    },
    type: {
      type: String,
      default() {
        return null
      }
    },
    warnText: {
      type: String,
      default() {
        return null
      }
    }
  }
}
</script>

<style lang="scss" scoped>

    .noContent {
        padding: 24px;

        .errorImg {
            margin: 0 auto;
            width: 135px;
        }

        p {
            margin-top: 12px;
            color: $text-9;
            font-size: 14px;
        }
    }
</style>
