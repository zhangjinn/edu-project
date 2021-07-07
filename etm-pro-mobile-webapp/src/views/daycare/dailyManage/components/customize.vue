<template>
  <div class="customize-wrap">
    <div class="name">
      <div>记录名称</div>
      <span>*</span>
    </div>
    <div class="text">
      <van-field
        v-model="typeName"
        placeholder="请输入记录名称"
        readonly
      />
    </div>
  </div>

</template>

<script>
/**
 * customize create by Administrator
 * createTime 2020/11/06 15:47
 */
export default {
  name: 'Customize',
  components: {},
  filters: {},
  mixins: [],
  props: {
    typeName: {
      type: String,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      text: ''
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.customize-wrap {
  background-color: #fff;
  .name {
    padding: 20px 12px;
    font-size: 15px;
    color: #222222;
    display: flex;
    align-items: center;
    border-bottom: #EEEEEE solid 1px;

    span {
      color: red;
    }
  }

  .text {
    ::v-deep .van-field__value {
      display: flex;
      justify-content: space-between;
    }
    border-radius: 4px;
    padding: 8px 0;
    ::v-deep .van-cell::after{
      display: none;
    }
  }
}
</style>
