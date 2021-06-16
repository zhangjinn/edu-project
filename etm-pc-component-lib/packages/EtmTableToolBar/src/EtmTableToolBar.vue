<template>
  <div class="EtmTableToolBar-wrap">
    <el-form inline>
      <el-form-item v-for="(item,index) of formData" :key="index">
        <!--输入框-->
        <template v-if="item.type === 'input'">
          <span class="label">{{ item.label }}</span>
          <el-input v-model="item.value" v-bind="{...item.props}" v-on="{...item.events}" />
        </template>

        <!--下拉框-->
        <template v-if="item.type === 'select'">
          <span class="label">{{ item.label }}</span>
          <el-select v-model="item.value" v-bind="{...item.props}" v-on="{...item.events}">
            <el-option v-for="(option, i) of item.options" :key="i" :label="option.label" :value="option.value" />
          </el-select>
        </template>

        <!--日期-->
        <template v-if="item.type === 'date'">
          <span class="label">{{ item.label }}</span>
          <el-date-picker v-model="item.value" value-format="yyyy-MM-dd" v-bind="{...item.props}" v-on="{...item.events}" />
        </template>

        <!--时间-->
        <template v-if="item.type === 'time'">
          <span class="label">{{ item.label }}</span>
          <el-time-select v-model="item.value" value-format="HH:mm:ss" v-bind="{...item.props}" v-on="{...item.events}" />
        </template>

      </el-form-item>

      <el-form-item>
        <slot />
      </el-form-item>

      <el-form-item v-if="$slots.right" class="btns-box" style="float: right;margin-right: 0;">
        <slot name="right" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
/**
   *  2020/4/26 13:38
   *  haijinsha
   */
export default {
  name: 'EtmTableToolBar',
  filters: {},
  mixins: [],
  props: {
    formData: {
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
    this.$nextTick(() => {
      if (this.$slots.right && this.$slots.right.length > 1) {
        console.error('EtmTableToolBar组件的slots的right属性只能有一个')
      }
    })
  },
  methods: {}
}
</script>

<style lang="scss">
@import "../../styles/src/etm/tableToolBar";
</style>
