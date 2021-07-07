<template>
  <div class="popup">
    <div class="select" @click="openPicker">
      <span class="selectName" :class="showMonthPicker ? 'mainColor' : ''">{{ title }}</span>
      <span v-if="showMonthPicker" class="mainColor iconfont iconarrow-up" />
      <span v-else class="iconfont iconarrow-down" />
    </div>
    <van-popup
      v-model="showMonthPicker"
      position="bottom"
      get-container="#app"
    >
      <van-picker
        title="请选择时间"
        show-toolbar
        :columns="columns"
        :default-index="defaultIndex"
        @confirm="onConfirm"
        @cancel="onCancel"
      />
    </van-popup>
  </div>
</template>

<script>

export default {
  name: 'Popup',
  props: {
    title: {
      type: String,
      default() {
        return null
      }
    },
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      showMonthPicker: false,
      defaultIndex: 0
    }
  },
  computed: {
    columns() {
      const result = []
      this.list.forEach(v => {
        result.push(v.name)
      })
      return result
    }
  },
  methods: {
    openPicker() {
      this.showMonthPicker = true
    },
    onCancel() {
      this.showMonthPicker = false
    },
    onConfirm(val, index) {
      this.onCancel()
      this.$emit('select', val)
      this.$emit('index', index)
    }
  }
}
</script>

<style lang="scss" scoped>
    .popup {
        &.big {
            .select {
                font-size: 16px;
            }
        }

        &.normal {
            .select {
                font-size: 15px;
            }
        }

        .select {
            display: inline-block;
            height: 45px;
            line-height: 45px;
            font-size: 14px;

            .selectName {
                display: inline-block;
                height: 18px;
                line-height: 18px;
            }

            .iconfont {
                margin-left: 6px;
                font-size: 12px;
                color: $text-5;
            }
        }
    }
</style>
