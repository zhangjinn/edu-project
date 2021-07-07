<template>
  <div class="descriptionWrap">
    <div class="title">
      <span>文字描述</span>
      <div>{{ commentText.length }}/300</div>
    </div>
    <van-field v-model.trim="commentText" rows="4" type="textarea" placeholder="描述宝宝当前的情况" :maxlength="300" />
    <van-uploader
      v-model="imgUrl"
      multiple
      :max-count="9"
      upload-icon="plus"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      commentText: '',
      imgUrl: []
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
.descriptionWrap {
  width: 351px;
  margin: 13px auto 0;
  background-color: $white;
  text-align: left;
  .title {
    height: 50px;
    padding: 0 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid $text-e;
    span {
      font-size: 15px;
    }
    div {
      font-size: 13px;
      color: #999;
    }
  }
  ::v-deep .van-field__control {
    font-size: 12px!important;
  }
  .van-field {
    padding: 10px 24px;
  }
  .van-uploader {
    margin-left: 24px;
  }
  ::v-deep .van-cell::after {
    display: none;
  }
  ::v-deep .van-uploader__upload {
    margin: 0 0 12px 0;
  }
}
</style>
