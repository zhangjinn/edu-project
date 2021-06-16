<template>
    <div class="highCode-wrap" :class="{show: show}">
        <etm-title>实例演示:</etm-title>
        <slot></slot>
        <etm-title>示例代码:</etm-title>
        <div class="code">
            <pre>
                <code>{{code}}</code>
            </pre>
            <div class="btn" @click="show = !show">
                {{show? '隐藏代码': '显示代码'}}
            </div>
        </div>
        <div class="description" v-if="description">
            <etm-title>描述信息:</etm-title>
            <div class="description__content">
                <div class="description__content__line"></div>
                <div class="description__content__text" v-html="description"></div>
            </div>
        </div>
    </div>

</template>

<script>
/**
 * highCode create by haijinsha
 * createTime 2020/6/29 14:34
 */
import highlight from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css';

export default {
  name: 'highCode',
  components: {},
  filters: {},
  mixins: [],
  props: {
    code: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      content: '',
      show: false,
      component: false
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.$nextTick().then(() => {
      this.init()
    })
  },
  methods: {
    init() {
      this.content = this.code
      setTimeout(() => {
        document.querySelectorAll('.highCode-wrap pre code').forEach(block => {
          highlight.highlightBlock(block);
        })
      }, 10)

    }
  }
}
</script>
<style lang="scss" scoped>
    .bg {
        background-color: rgba(0,0,0,0.5);
    }
    .highCode-wrap {
        h3 {
            margin: 0;
        }

        .code {
            transition: all 1s;
            height: 100px;
            overflow: hidden;
            position: relative;
            margin-bottom: 16px;

            pre {
                color: #fff;
                margin: 8px 0;
                padding: 0;
            }
        }

        .btn {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 32px;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            @extend .bg;
        }

        .description {
            &__content {
                border-radius: 4px;
                overflow: hidden;
                display: flex;
                background-color: #171616;
                height: 100%;

                &__line {
                    width: 4px;
                    @extend .bg;
                }

                &__text {
                    flex: 1;
                    color: #ccc;
                    padding: 24px;
                }


            }
        }

    }

    .show {
        .code {
            transition: all 1s;
            height: auto;

            .btn {
                position: absolute;
                bottom: 8px;
                left: 0;
                right: 0;
                height: 32px;
                color: #fff;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 0 0 6px 6px;
                user-select: none;
                @extend .bg;
            }
        }
    }
</style>
