<template>
  <div class="chartPop-wrap">
    <div class="title">最多可选5个统计图表</div>
    <div class="selectCount">
      <span class="labeltext">已选：</span>
      <span class="errorNumber">{{ selectResult.length }}</span>
      <span class="mainNumber">/5</span>
    </div>
    <div class="list">
      <div
        v-for="(data, i) in menuData"
        :key="i"
        class="menu"
        :class="selectResult.includes(data.name) ? 'isActive' : ''"
        @click="addMenu(data)"
      >{{ data.name }}
      </div>
    </div>
  </div>

</template>

<script>
/**
 * chartPop create by Administrator
 * createTime 2020/9/25 9:54
 */
export default {
  name: 'ChartPop',
  components: {},
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      menuData: [
        {
          name: '收入/支出'
        },
        {
          name: '健康检查'
        },
        {
          name: '幼儿考勤'
        },
        {
          name: '净现金流'
        }
      ],
      selectResult: [],
      selectData: []
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    addMenu(data) {
      if (this.selectResult.includes(data.name)) {
        this.selectData.forEach((item, index) => {
          if (item.name === data.name) {
            this.selectData.splice(index, 1)
            this.selectResult.splice(this.selectResult.indexOf(data.name), 1)
            return
          }
        })
      } else {
        if (this.selectData.length < 5) {
          this.selectData.push(data)
          this.selectResult.push(data.name)
        } else {
          this.$message.warning('最多可选择5个统计图表展示')
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.chartPop-wrap {
  .title {
    padding-bottom: 16px;
    font-size: 16px;
    @include c_title_color();
  }

  .selectCount {
    display: flex;
    padding-bottom: 16px;

    .labeltext {
      @include c_secondary_color();
    }

    .errorNumber {
      @include c_error_color();
    }

    .mainNumber {
      @include c_title_color();
    }
  }
  .list {
    display: flex;
    flex-wrap: wrap;

    .menu {
      padding: 0 15px;
      margin: 0 16px 16px 0;
      height: 32px;
      line-height: 32px;
      @include c_text_color();
      border: 1px solid $divide-color;
      border-radius: 4px;
      cursor: pointer;

      &.isActive {
        @include c_white();
        @include bgc_main_color();
        @include bc_main_color();
      }
    }
  }
}
</style>
