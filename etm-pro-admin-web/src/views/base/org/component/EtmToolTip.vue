<template>
  <div class="EtmToolTip-wrap">
    <div v-if="text.length <= max">{{ text }}</div>
    <el-tooltip v-else class="item" effect="dark" placement="bottom">
      <div slot="content" class="content" v-html="formatStr(text, min)" />
      <span class="tree-label" v-text="sliceStr(text, max)" />
    </el-tooltip>
  </div>

</template>

<script>
/**
 * EtmToolTip create by haijinsha
 * createTime 2021/3/16 14:11
 */
export default {
  name: 'EtmToolTip',
  components: {},
  filters: {},
  mixins: [],
  props: {
    min: {
      type: Number,
      default: 5
    },
    max: {
      type: Number,
      default: 10
    },
    text: {
      type: String,
      default: ''
    },
    ellipsis: {
      type: String,
      default: '...'
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
    /**
     * 切割字符串 大于7个时切割
     * @param {string} str
     * @param {number} count
     */
    sliceStr(str, count) {
      if (!str) {
        return str
      }
      if (str.length > count) {
        return str.slice(0, count) + this.ellipsis
      } else {
        return str
      }
    },
    /**
     * 格式化字符串, 每隔count个时加一个换行符
     * @param {string} str
     * @param {number} count 个数
     */
    formatStr(str, count) {
      if (!str) {
        return str
      }
      let result = ''
      for (let i = 0; i < str.length; i++) {
        if (i && i % count === 0) {
          result += '</br>' + str[i]
        } else {
          result += str[i]
        }
      }
      return result
    }
  }
}
</script>
<style lang="scss" scoped>
.EtmToolTip-wrap {
  display: inline-block;
}
</style>
