<template>
  <div class="card-item-wrap">
    <div
      class="card-header"
      :style="{'background-image': 'url('+ item.cover +')'}"
    >
      <el-tag
        v-if="statusObj[item.status]"
        class="tag"
        effect="dark"
        :type="getTagType(item.status)"
      >
        {{ statusObj[item.status] }}
      </el-tag>
      <div class="mask">
        <el-dropdown
          class="dropdown"
          @command="$emit('deauthorize', item)"
        >
          <span class="el-dropdown-link">···</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button
          class="prev-btn"
          type="primary"
          size="medium"
          plain
          @click.stop="$emit('preview', item)"
        >
          预览
        </el-button>
      </div>
      <div
        class="qr-bg"
        @mouseover="handleQrSizeChange(160)"
        @mouseleave="handleQrSizeChange(16)"
      >
        <vue-qr
          class="qr"
          :size="qrSize"
          :text="item.url"
        />
      </div>
    </div>
    <div class="card-content">
      <div class="card-name">
        {{ item.name }}
      </div>
      <div class="card-btn">
        <el-button
          v-for="(it, index) in options[type].button"
          :key="index"
          type="text"
          @click="$emit(it.emit, item)"
        >
          <div><i :class="[it.icon, 'iconfont']" /></div>
          <div>{{ it.name }}</div>
        </el-button>
      </div>
    </div>
    <el-divider />
    <ul class="card-footer">
      <li v-if="Object.keys(item).includes('pv') && options[type].footer.includes('pv')">
        <span>{{ item.pv }} </span>浏览
      </li>
      <li v-if="Object.keys(item).includes('uv') && options[type].footer.includes('uv')">
        <span>{{ item.uv }} </span>访客
      </li>
      <li v-if="Object.keys(item).includes('fpv') && options[type].footer.includes('fpv')">
        <span>{{ item.fpv }} </span>表单
      </li>
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
  data () {
    return {
      statusObj: {
        0: '未发布',
        1: '已发布',
        // '2': '停用',
        3: '有修改'
        // '4': '删除',
        // '-1': '审核不通过'
      },
      qrSize: 16,
      options: {
        h5: {
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
        h2: {
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
        hd: {
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
    getTagType (status) {
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
    handleQrSizeChange (size) {
      this.qrSize = size
    }
  }
}
</script>
<style lang="scss" scoped>
.card-item-wrap {
  .card-header {
    //background-size: cover;
    //background-repeat: no-repeat;
    //background-position: 100% 100%;
    background: 100%/100% no-repeat;
    background-size: cover;
    height: 226px;
    position: relative;

    .tag {
      left: 8px;
      position: absolute;
      top: 8px;
      z-index: 1;
    }

    .mask {
      align-items: center;
      background-color: rgba(0, 0, 0, 0.8);
      //z-index: 2;
      display: flex;
      height: 100%;
      justify-content: center;
      opacity: 0;
      position: absolute;
      transition: top 0.2s ease,opacity 0.2s ease,height 0.2s ease;
      width: 100%;

      .prev-btn {
        height: 40px;
        width: 110px;
      }

      .dropdown {
        background: rgba(255, 255, 255, 0.3);
        border-radius: 10px;
        box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
        color: #fff;
        font-size: 18px;
        font-weight: 500;
        height: 20px;
        letter-spacing: 2px;
        position: absolute;
        right: 8px;
        top: 8px;
        width: 32px;

        .el-dropdown-link {
          align-items: center;
          display: flex;
          height: 100%;
          justify-content: center;
          width: 100%;
        }
      }
    }

    .qr-bg {
      align-items: center;
      background-color: rgba(0, 0, 0, 0.5);
      bottom: 8px;
      display: flex;
      height: 24px;
      justify-content: center;
      position: absolute;
      right: 8px;
      width: 24px;
      //transition: width .2s ease, height .2s ease, height .2s ease ;
      &:hover {
        background: #fff;
        bottom: auto;
        height: 226px;
        right: auto;
        width: 100%;
      }
    }
  }

  .card-content {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    font-size: 14px;
    font-weight: 400;
    height: 68px;
    justify-content: center;
    padding: 0 16px;
    position: relative;

    .card-name {
      overflow: hidden;
      text-align: center;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .card-btn {
      align-items: center;
      background: #fff;
      display: none;
      height: 100%;
      justify-content: space-around;
      padding: 0 26px;
      position: absolute;
      width: 100%;
      z-index: 2;

      div {
        color: #555;
        font-size: 12px;
      }

      .el-button:hover {
        div {
          @include etm-color; }
      }

      .el-button {
        div:first-child {
          margin-bottom: 12px;
        }
      }

      i {
        font-size: 20px;
      }
    }
  }

  .card-footer {
    display: flex;
    flex-direction: row;
    font-size: 12px;
    padding: 8px 16px;
    //justify-content: center;
    li {
      margin-right: 16px;

      span {
        @include etm-color;
      }
    }
  }

  &:hover {
    .mask {
      opacity: 1;
    }

    .card-btn {
      display: flex;
    }
  }

  .el-divider--horizontal {
    margin: 0;
  }
}
</style>
