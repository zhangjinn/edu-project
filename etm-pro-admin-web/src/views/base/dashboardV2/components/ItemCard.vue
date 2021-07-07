<template>
  <div :style="{background: `url(${backgroundImage}) no-repeat center center/cover`}" class="ItemCard-wrap" @click="$emit('click')">
    <span class="close el-icon-error" @click.stop="$emit('close')" />
    <div class="content">
      <div class="count"> {{ unit }}
        <span v-for="(item, index) of resultData.currentMonth" :key="index">
          {{ item }}
          {{ resultData.currentMonth.length - 1 === index ? '' : '/' }}</span>
      </div>
      <div class="name">本月{{ prop.displayName }}</div>
    </div>
  </div>

</template>

<script>/**
 * ItemCard create by haijinsha
 * createTime 2020/11/23 15:28
 */

import service from '@/utils/request'

export default {
  name: 'ItemCard',
  components: {},
  filters: {},
  mixins: [],
  props: {
    prop: {
      type: Object,
      default() {
        return {}
      }
    },
    backgroundImage: {
      type: [Image, String],
      default: ''
    }
  },
  data() {
    return {
      resultData: [],
      unit: ''
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    try {
      this.init()
    } catch (e) {
      console.error(e)
    }
  },
  methods: {
    init() {
      const { url, params } = JSON.parse(this.prop.dataApi)

      const { unit } = JSON.parse(this.prop.config)
      this.unit = unit
      service({ url, method: 'get', params }).then(res => {
        this.resultData = res.data
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.ItemCard-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 204px;
  height: 144px;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  color: $white;
  transition: all .3s;

  &:not(:last-child) {
    margin-right: 24px;
  }

  .close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    position: absolute;
    right: 10px;
    top: 10px;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    color: rgba(255,255,255,.6);
    visibility: hidden;

    &:hover {
      color: $white;
    }
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-weight: bold;

    .count {
      &, & span {
        font-size: 20px;
      }
    }

    .name {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.8);
    }
  }

  &:hover {
    .close {
      visibility: visible;
    }
  }
}
</style>
