<template>
  <div class="record-wrap">
    <van-cell v-for="(item, index) in clazzInfoData" :key="index">
      <span style="font-size: 13px; color: #222222;">{{ item.courseName }}({{ item.clazzName }})</span>
      <van-row class="meals-info" type="flex" justify="space-around">
        <van-col>
          <van-row>
            <van-col class="count">{{ item.currentFormalChildNum }}</van-col>
          </van-row>
          <van-row>
            <van-col class="clazz-info">正式学员</van-col>
          </van-row>
        </van-col>
        <van-col>
          <van-row>
            <van-col class="count">{{ item.currentExpChildNum }}</van-col>
          </van-row>
          <van-row>
            <van-col class="clazz-info">试听学员</van-col>
          </van-row>
        </van-col>
        <van-col>
          <van-row>
            <van-col class="count">{{ item.askForLeaveNum }}</van-col>
          </van-row>
          <van-row>
            <van-col class="clazz-info">请假学员</van-col>
          </van-row>
        </van-col>
      </van-row>
    </van-cell>
  </div>

</template>

<script>
/**
 * record create by 油麦菜
 * createTime 2020/9/21 16:55
 */
export default {
  name: 'ClazzInfo',
  components: {
  },
  filters: {},
  mixins: [],
  props: {
    clazzInfoData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.record-wrap {
  padding: 0 10px;
  .van-cell {
    margin-bottom: 10px;
  }
  .meals-info{
    margin-top: 10px;
    .clazz-info {
      font-size: 12px;
      color: #999999;
    }
    .count {
      width: 100%;
      text-align: center;
      font-size: 14px;
      color: $theme;
    }
  }
}
</style>
