<template>
  <div class="fileItem" :class="{choice : isChoice.isChoice}" @click="clickFile" @dblclick="dblclickFile">
    <div v-if="!disable" class="file-boxs-chiose" @click.stop="choice">
      <i class="iconfont iconsuccess" />
    </div>
    <div v-if="item.type === 'image'" class="file-image">
      <!--      图片文件-->
      <figure class="prevImg">
        <a :href="item.url" :data-size="imgSize">
          <el-image :src="item.url + '?imageView2/1/w/100/h/100'" fit="cover" style="width:86px; height:86px" />
        </a>
      </figure>
    </div>
    <div v-else class="file-logo">
      <!--      其他文件-->
      <img :src="require(`@/assets/images/cloud/${item.type}.png`)" :alt="item.name">
    </div>
    <p class="file-name" :title="item.name">{{ item.name }}</p>
  </div>
</template>

<script>
import axios from 'axios'
// import { debounce } from '@/views/base/cloudDisk/components/common'
let timer = ''
// const debounceStore = {
//   click: false,
//   dbclick: false
// }
export default {
  name: 'FileItem',
  components: {
  },
  model: {
    prop: 'isChoice',
    event: 'evt'
  },
  props: {
    isChoice: {
      type: Object,
      default() {
        return {}
      }
    },
    disable: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      // isChoice: false,
      imgSize: '10x10',
      width: 'auto',
      height: 'auto'
    }
  },
  mounted() {
  },
  created() {
    // 图片预览需要数据
    if (this.item.type === 'image') {
      axios({
        url: this.item.url + '?imageInfo',
        method: 'get'
      }).then(res => {
        // console.log(res)
        const img = res.data
        if (img.width > img.height) {
          this.height = '86px'
          this.width = (img.width / img.height * 86) + 'px'
        } else if (img.height > img.width) {
          this.height = (img.height / img.width * 86) + 'px'
          this.width = '86px'
        } else {
          this.width = '86px'
          this.height = '86px'
        }
        this.imgSize = `${img.width}x${img.height}`
      })
    }
  },
  methods: {
    // debounceEvent(key, fn) {
    //   if (!debounceStore[key]) {
    //     debounceStore[key] = debounce(fn, 160)
    //     debounceStore[key]()
    //   } else {
    //     debounceStore[key]()
    //   }
    // },
    // 双击事件
    dblclickFile() {
    },
    // 单击事件
    clickFile() {
      clearTimeout(timer)
      timer = setTimeout(() => {
        this.$emit('file', Object.assign({}, this.item))
      }, 240)
    },
    choice() {
      this.isChoice.isChoice = !this.isChoice.isChoice
      this.$emit('choice', Object.assign({}, this.item, { choice: this.isChoice.isChoice }))
    }
  }
}
</script>

<style scoped lang="scss">
.fileItem{
    width: 122px;
    height: 129px;
    border-radius: 6px;
    border: 1px solid transparent;
    margin: 0 10px 10px 0;
    position: relative;
    overflow: hidden;
    transition: border .1s ease-in;
    cursor: pointer;

  .prevImg{
    margin: 0;
    padding: 0;

    a{
      display: block;
    }
  }

  &.choice{

    .file-boxs-chiose{
      opacity: 1;
    }

    &:before{
      opacity: .1;
    }

    &:hover{
      border-color: $main-color;

      &:before {
        opacity: .1;
      }

      .file-boxs-chiose{
        opacity: 1;
        &:hover{
          opacity: 1;
        }
      }
    }
  }

  .file-image{
    width: 86px;
    height: 86px;
    position: absolute;
    top: 10px;
    left: 50%;
    overflow: hidden;
    transform: translate(-50%, 0);

    //img {
    //  position: absolute;
    //  display: block;
    //  //max-width: 100%;
    //  //max-height: 100%;
    //  top: 50%;
    //  left: 50%;
    //  transform: translate(-50%,-50%);
    //}
  }

  .file-logo{
    height: 60px;
    width: 90%;
    position: absolute;
    top: 22px;
    left: 50%;
    transform: translate(-50%, 0);
    display: flex;
    justify-content: center;

    & > img{
      display: block;
      width: auto;
      height: 100%;
    }
  }
  .file-boxs-chiose {
    width: 20px;
    height: 20px;
    position: absolute;
    display: block;
   // color: $main-color;
    @include etm-color;
    top: 2px;
    border-radius: 50%;
    overflow: hidden;
    transition: all .1s ease-in;
    left: 6px;
    z-index: 10;
    opacity: 0;
    i {
      font-size: 16px;
      display: block;
      width: 20px;
      height: 20px;
      &::before{
        width: 20px;
        display: block;
        height: 20px;
      }
    }
  }

  .file-name {
    position: absolute;
    bottom: 10px;
    line-height: 1.4;
    font-size: 14px;
    color: #555555;
    margin: 0 4px;
    text-align: center;
    width: 112px;
    word-break:keep-all;/* 不换行 */
    white-space:nowrap;/* 不换行 */
    overflow:hidden;
    text-overflow:ellipsis;
  }

  &:hover{
    //border: 1px solid $main-color;
    @include etm_bdc;

    &:before {
      opacity: .1;
    }

    .file-boxs-chiose{
      opacity: .2;

      &:hover{
        opacity: .8;
      }
    }
  }

  &:before {
     content: '';
     width: 100%;
     height: 100%;
     //background: $main-color;
    @include etm-bgc;
     position: absolute;
     top: 0;
     left: 0;
     opacity: 0;
     transition: all .1s ease-in;
  }
}
</style>
