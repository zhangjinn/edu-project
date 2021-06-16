<template>
  <div class="richText-wrap">
    <quill-editor
      ref="myQuillEditor"
      v-model="richContent"
      :options="editorOption"
    />
  </div>
</template>

<script>
/**
 * richText create by 油麦菜
 * createTime 2020/11/10 9:19
 */
import { quillEditor } from 'vue-quill-editor'
import { quillEditorTip } from './richTextTip'
import Quill from 'quill'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // 加粗，斜体，下划线，删除线
  ['blockquote', 'code-block'], // 引用，代码块
  [{ header: 1 }, { header: 2 }], // 标题，键值对的形式；1、2表示字体大小
  [{ list: 'ordered' }, { list: 'bullet' }], // 列表
  [{ script: 'sub' }, { script: 'super' }], // 上下标
  [{ indent: '-1' }, { indent: '+1' }], // 缩进
  [{ direction: 'rtl' }], // 文本方向
  [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
  [{ header: [1, 2, 3, 4, 5, 6, false] }], // 几级标题
  [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
  [{ font: [] }], // 字体
  [{ align: [] }], // 对齐方式
  ['link', 'image', 'video'], // 超链接、上传图片、上传视频
  ['clean'] // 清除字体样式
]
const BlockEmbed = Quill.import('blots/block/embed')

class VideoBlot extends BlockEmbed {
  static create (value) {
    const node = super.create()
    node.setAttribute('src', value.url)
    node.setAttribute('controls', true)
    node.setAttribute('width', value.width)
    node.setAttribute('height', value.height)
    node.setAttribute('muted', true)
    node.setAttribute('autoplay', false)
    node.setAttribute('style', value.style)
    return node
  }

  static value (node) {
    return {
      url: node.getAttribute('src'),
      width: node.getAttribute('width'),
      height: node.getAttribute('height'),
      style: node.getAttribute('style')
    }
  }
}
VideoBlot.blotName = 'video'
VideoBlot.tagName = 'video'
Quill.register(VideoBlot)

export default {
  name: 'RichText',
  components: {
    quillEditor
  },
  filters: {},
  mixins: [],
  props: {
    content: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请输入内容...'
    }
  },
  data () {
    return {
      richContent: this.content,
      editorOption: {
        // Some Quill options...
        placeholder: this.placeholder,
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              image (value) {
                if (value) {
                  document.querySelector('.file-image').click()
                  // document.querySelector('.upload-file').click()
                } else {
                  this.quill.format('image', false)
                }
              },
              video (value) {
                if (value) {
                  document.querySelector('.file-image').click()
                } else {
                  this.quill.format('video', false)
                }
              }
              // link(value) {
              //   console.log(value)
              //   console.log('超链接暂时未做，有bug，没有弹出输入框')
              // }
            }
          }
        }
      }
    }
  },
  computed: {
  },
  watch: {
    richContent (newVal, oldVal) {
      this.$emit('richTextChange', newVal)
    },
    content (newVal, oldVal) {
      this.richContent = newVal
    }
  },
  created () {
  },
  mounted () {
    quillEditorTip()
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.richText-wrap {
  .quill-editor {
    margin-bottom: 16px;

    ::v-deep.ql-toolbar.ql-snow {
      background: #eef1f5;
      border: 0;
    }

    ::v-deep.ql-toolbar.ql-snow + .ql-container.ql-snow {
      // height: 180px; // 富文本的编辑区自适应高度
      border: 0;

      .ql-editor {
        max-height: 400px;
        min-height: 200px;
        overflow-y: auto;

        &::-webkit-scrollbar {
          display: none;
        }
      }

      .ql-editor.ql-blank::before {
        font-style: normal !important;
      }
    }
  }
}
</style>
