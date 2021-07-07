<template>
  <div class="card-item-wrap">
    <div class="card-header" :style="{'background-image': 'url('+ item.cover +')'}">
      <el-tag v-if="statusObj[item.status]" class="tag" effect="dark" :type="getTagType(item.status)">
        {{ statusObj[item.status] }}
      </el-tag>
      <div class="mask">
        <el-dropdown class="dropdown" @command="$emit('deauthorize', item)">
          <span class="el-dropdown-link">···</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button class="prev-btn" type="primary" size="medium" plain @click.stop="$emit('preview', item)">
          预览
        </el-button>
      </div>
      <div class="qr-bg" @mouseover="handleQrSizeChange(160)" @mouseleave="handleQrSizeChange(16)">
        <vue-qr class="qr" :size="qrSize" :text="item.url" />
      </div>
    </div>
    <div class="card-content">
      <div class="card-name">{{ item.name }}</div>
      <div class="card-btn">
        <el-button v-for="(it, index) in options[type].button" :key="index" type="text" @click="$emit(it.emit, item)">
          <div><i :class="[it.icon, 'iconfont']" /></div>
          <div>{{ it.name }}</div>
        </el-button>
      </div>
    </div>
    <el-divider />
    <ul class="card-footer">
      <li v-if="Object.keys(item).includes('pv') && options[type].footer.includes('pv')"><span>{{ item.pv }} </span>浏览</li>
      <li v-if="Object.keys(item).includes('uv') && options[type].footer.includes('uv')"><span>{{ item.uv }} </span>访客</li>
      <li v-if="Object.keys(item).includes('fpv') && options[type].footer.includes('fpv')"><span>{{ item.fpv }} </span>表单</li>
      <li
        v-if="
          options[type].footer.includes('width')
            && options[type].footer.includes('height')
            && options[type].footer.includes('unit')
        "
      >
        {{ item.width }}*{{ item.height }} {{ item.unit }}
      </li>
    </ul>
  </div>

</template>

<script>
import vueQr from 'vue-qr'

/**
 * CardItem create by shangLu
 * createTime 2020/10/22 14:44
 */
export default {
  name: 'CardItem',
  components: {
    vueQr
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    type: {
      type: String,
      default: 'h5'
    }
  },
  data() {
    return {
      statusObj: {
        '0': '未发布',
        '1': '已发布',
        // '2': '停用',
        '3': '有修改'
        // '4': '删除',
        // '-1': '审核不通过'
      },
      qrSize: 16,
      options: {
        'h5': {
          button: [
            {
              icon: 'iconedit-square2',
              name: '编辑',
              emit: 'edit'
            },
            {
              icon: 'iconlinechart',
              name: '数据',
              emit: 'analysis'
            },
            {
              icon: 'iconshare',
              name: '分享',
              emit: 'share'
            }
          ],
          footer: ['pv', 'uv', 'fpv']
        },
        'h2': {
          button: [
            {
              icon: 'iconedit-square2',
              name: '编辑',
              emit: 'edit'
            },
            {
              icon: 'icondownload',
              name: '下载',
              emit: 'dowload'
            }
          ],
          footer: ['width', 'height', 'unit']
        },
        'hd': {
          button: [
            {
              icon: 'iconedit-square2',
              name: '编辑',
              emit: 'edit'
            },
            {
              icon: 'iconsetting',
              name: '活动管理',
              emit: 'manage'
            },
            {
              icon: 'iconshare',
              name: '分享',
              emit: 'share'
            }
          ],
          footer: ['pv', 'uv', 'fpv']
        }
      }
    }
  },
  methods: {
    getTagType(status) {
      let type
      switch (status) {
        case 0:
          type = 'danger'
          break
        case 1:
          type = ''
          break
        // case 2:
        //   type = 'danger'
        //   break
        // case 3:
        //   type = 'warning'
        //   break
        // case 4:
        //   type = 'danger'
        //   break
        // case -1:
        //   type = 'danger'
        //   break
        default:
          type = ''
          break
      }
      return type
    },
    handleQrSizeChange(size) {
      this.qrSize = size
    }
  }
}
</script>
<style lang="scss" scoped>
.card-item-wrap {
  .card-header{
    height: 226px;
    //background-size: cover;
    //background-repeat: no-repeat;
    //background-position: 100% 100%;
    background:100%/100% no-repeat;
    background-size: cover;
    position: relative;
    .tag{
      position: absolute;
      left: 8px;
      top: 8px;
      z-index: 1;
    }
    .mask{
      width: 100%;
      height: 100%;
      position: absolute;
      opacity: 0;
      background-color: rgba(0,0,0,.8);
      transition: top .2s ease,opacity .2s ease,height .2s ease;
      //z-index: 2;
      display: flex;
      justify-content: center;
      align-items: center;
      .dropdown{
        position: absolute;
        right: 8px;
        top: 8px;
      }
      .prev-btn{
        width: 110px;
        height: 40px;
      }
      .dropdown{
        width: 32px;
        height: 20px;
        background: rgba(255,255,255,0.3);
        -webkit-box-shadow: 0 4px 12px 0 rgba(0,0,0,0.08);
        box-shadow: 0 4px 12px 0 rgba(0,0,0,0.08);
        border-radius: 10px;
        color: #fff;
        letter-spacing: 2px;
        font-weight: 500;
        font-size: 18px;
        .el-dropdown-link{
          display: flex;
          width: 100%;
          height: 100%;
          align-items: center;
          justify-content: center;
        }
      }
    }
    .qr-bg{
      width: 24px;
      height: 24px;
      background-color: rgba(0,0,0,.5);
      position: absolute;
      bottom: 8px;
      right: 8px;
      display: flex;
      justify-content: center;
      align-items: center;
      //transition: width .2s ease, height .2s ease, height .2s ease ;
      &:hover{
        background: #fff;
        width: 100%;
        height: 226px;
        bottom: auto;
        right: auto;
      }
    }
  }
  .card-content{
    height: 68px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 16px;
    box-sizing: border-box;
    position: relative;
    font-size: 14px;
    font-weight: 400;
    .card-name{
      text-align: center;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .card-btn{
      padding: 0 26px;
      display: none;
      position: absolute;
      width: 100%;
      height: 100%;
      align-items: center;
      z-index: 2;
      justify-content: space-around;
      background: #fff;
      div{
        color: #555555;
        font-size: 12px;
      }
      & .el-button:hover{
        div{
          @include etm-color
        }
      }
      .el-button{
        div:first-child{
          margin-bottom: 12px;
        }
      }
      i{
        font-size: 20px;
      }
    }
  }
  .card-footer{
    padding: 8px 16px;
    display: flex;
    flex-direction: row;
    font-size: 12px;
    //justify-content: center;
    li{
      margin-right: 16px;
      span{
        @include etm-color;
      }
    }
  }
  &:hover{
    .mask{
      opacity: 1;
    }
    .card-btn{
      display: flex;
    }
  }
  .el-divider--horizontal{
    margin: 0;
  }
}
</style>
