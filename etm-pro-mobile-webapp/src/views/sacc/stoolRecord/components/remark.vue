<template>
  <div class="remarkWrap">
    <div class="title">
      <h5>备注</h5>
      <span class="count">{{ count }}/500</span>
    </div>
    <textarea ref="text" placeholder="请输入备注内容..." />
    <van-field name="uploader">
      <template #input>
        <van-uploader v-model="uploader" upload-icon="plus" />
      </template>
    </van-field>
  </div>
</template>

<script>
export default {
  name: 'Remark',
  data() {
    return {
      count: 0,
      uploader: []
    }
  },
  mounted() {
    const _self = this
    this.$refs.text.onkeyup = function(e) {
      _self.count = this.value.length
    }
  },
  beforeDestroy() {
    this.$refs.text.onkeyup = null
  }
}
</script>

<style lang="scss" scoped>
    @import '../../../../assets/style/mixin';

    .remarkWrap {
        padding: 0 12px;
        text-align: left;

        .title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 10px;

            h5 {
                font-weight: normal;
                font-size: 15px;
            }

            .count {
                color: $text-9;
                font-size: 12px;
            }
        }

        textarea {
            width: 100%;
            height: 114px;
            margin-top: 20px;
            resize: none;
            font-size: 15px;
            color: $text-9;
        }

        .van-cell {
            padding: 10px 0;
        }

        .van-cell::after {
            display: none;
        }
    }
</style>
