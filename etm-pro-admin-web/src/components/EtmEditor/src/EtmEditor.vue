<template>
  <div class="EtmEditor-wrap">
    <div class="example">
      <quill-editor
        ref="myTextEditor"
        class="editor"
        :value="content"
        :options="editorOption"
        @change="onEditorChange"
        @blur="onEditorBlur($event)"
        @focus="onEditorFocus($event)"
        @ready="onEditorReady($event)"
      />
    </div>
  </div>
</template>

<script>
/**
   *  2020/4/16 10:40
   *  haijinsha
   */
import { quillEditor } from 'vue-quill-editor'
// highlight.js style
// import 'highlight.js/styles/tomorrow.css'
// import theme style
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default {
  name: 'EtmEditor',
  title: 'Theme: snow',
  components: {
    quillEditor
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            // [{ 'size': ['small', false, 'large', 'huge'] }],
            // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            // [{ 'font': [] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            ['clean'],
            ['image']
          ]
        }
      },
      content: this.value
    }
  },
  computed: {
    editor() {
      return this.$refs.myTextEditor.quill
    }
    // contentCode() {
    //   // return hljs.highlightAuto(this.content).value
    // }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        console.log('watch')
        this.content = val
      }
    }
  },
  mounted() {
  },
  methods: {
    onEditorChange: function(value) {
      this.content = value.html
      this.$emit('input', this.content)
    },
    onEditorBlur(editor) {
      this.$emit('input', this.content)
    },
    onEditorFocus(editor) {
      this.$emit('input', this.content)
    },
    onEditorReady(editor) {
      this.$emit('input', this.content)
    }
  }
}
</script>

<style lang="scss" scoped>
  .EtmEditor-wrap {
    /*padding-right: 24px;;*/

    .quill-editor {
      min-height: 300px
    }

    & /deep/ .ql-container {
      min-height: 300px
    }

    & /deep/ .ql-editor {
      min-height: 300px;
    }

    .ql-snow .ql-editor img {
      max-width: 480px
    }

    .ql-editor .ql-video {
      max-width: 480px
    }
  }
</style>
