<template>
  <div class="radioListWrap">
    <h5>{{ title }}</h5>
    <ul>
      <li
        v-for="(item, index) in listData"
        :key="index"
        :class="value === item.value ? 'actived' : ''"
        @click.stop="select(item.value)"
      >{{ item.name || '未知' }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'RadioList',
  props: {
    listData: {
      type: Array,
      default() {
        return []
      }
    },
    title: {
      type: String,
      default: '标题'
    },
    value: {
      type: String,
      required: true
    }
  },
  methods: {
    select(value) {
      this.$emit('update:value', value)
    }
  }
}
</script>

<style lang="scss" scoped>
    @import '../../../../assets/style/mixin';

    .radioListWrap {
        text-align: left;
        padding: 0 12px;

        h5 {
            font-weight: normal;
            font-size: 15px;
            margin-top: 18px;
        }

        ul {
            display: flex;
            flex-wrap: wrap;
            margin-top: 12px;

            li {
                width: 62px;
                height: 36px;
                line-height: 34px;
                border: 1px solid $text-e;
                font-size: 15px;
                color: $text-9;
                border-radius: 3px;
                text-align: center;
                margin: 0 16px 10px 0;

                &.actived {
                    color: $white;
                    background-color: $theme;
                    border-color: $theme;
                }
            }
        }
    }
</style>
