<template>
  <div class="index-wrap cameraSetting">
    <etm-layout-split>
      <el-row>
        <el-alert
          title="温馨提示：必须使用海康威视（萤石）摄像头"
          type="warning"
          :closable="true"
        />
      </el-row>

      <!--<el-row>-->
      <!--  <el-col>-->
      <!--<div class="title-box">-->
      <!--<img style="width: 32px;margin-right: 8px;" src="../../../assets/images/jiankong.png" alt="">-->
      <!--<span class="title">云视频接入设置</span>-->
      <!--<span class="iconBox">-->
      <!--  <el-tooltip effect="light" popper-class="stepTips" :visible-arrow="false" placement="bottom-start">-->
      <!--    <div slot="content">-->
      <!--      <p>1、{{ $t('systemSetting.tipsOne') }}</p>-->
      <!--      <p>2、{{ $t('systemSetting.tipsTwo') }}</p>-->
      <!--      <p>3、{{ $t('systemSetting.tipsThree') }}</p>-->
      <!--    </div>-->
      <!--    <i class="iconfont iconquestion-circle" />-->
      <!--  </el-tooltip>-->
      <!--</span>-->
      <!--</div>-->
      <!--  </el-col>-->
      <!--</el-row>-->

      <el-row>
        <el-col class="el-col">
          <img src="../../../assets/images/jiankong_logo_01.png">
          <div class="title">云视频接入设置</div>
        </el-col>
        <el-col class="el-col">
          <div class="col-item">
            <div class="info">01.登录萤石开放平台</div>
            <div class="input-box">
              <el-input id="success_form_input" value="https://open.ys7.com" readonly />
            </div>
            <div>
              <el-button
                type="primary"
                class="copyBtn"
                data-clipboard-action="copy"
                data-clipboard-target="#success_form_input"
                @click="copyAddress"
              >复制地址
              </el-button>
            </div>
          </div>
        </el-col>
        <el-col class="el-col second-col">
          <div class="col-item">
            <span class="info">02.注册萤石开放平台账号</span>
            <div class="btn-box">
              <el-button type="primary" @click="detail">查看教程</el-button>
            </div>
          </div>
        </el-col>

        <el-col class="el-col-two">
          <img src="../../../assets/images/jiankong_logo_02.png">
          <div class="title">云视频接入信息填写</div>
        </el-col>

        <el-col class="el-col">
          <div class="col-item">
            <div class="info">AppKey</div>
            <div class="input-box">
              <el-input v-model="obj.appKey" placeholder="填写appkey" />
            </div>
          </div>
        </el-col>

        <el-col class="el-col">
          <div class="col-item">
            <div class="info">Secret</div>
            <div class="input-box">
              <el-input v-model="obj.appSecret" placeholder="填写secret" />
            </div>
          </div>
        </el-col>

        <el-col class="el-col-btn">
          <el-button type="primary" @click="save">保存</el-button>
          <el-button plain @click="$router.go(-1)">取消</el-button>
        </el-col>
      </el-row>

    </etm-layout-split>

    <div v-if="visible" class="tutorial">
      <div class="carouselBox">
        <el-carousel :autoplay="false" :loop="false" arrow="always" height="570px">
          <el-carousel-item v-for="(item, index) in list" :key="index">
            <div class="innerBox">
              <span class="closeIcon iconfont iconclose" @click="visible = false" />
              <div class="count">
                <span class="currentCount">0{{ item.count }}</span><span class="total">/0{{ list.length }}</span>
              </div>
              <div class="explanation" v-html="item.html" />
              <div class="imgBox">
                <img :src="item.url">
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
  </div>

</template>

<script>/**
 * index create by haijinsha
 * createTime 2020/10/20 18:37
 */

import { queryVideoSetting, updateVideoSetting } from '@/api/base/base'

export default {
  name: 'Index',
  components: {},
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      visible: false,
      obj: {
        address: '',
        appKey: '',
        appSecret: ''
      },
      list: [
        {
          url: require('../../../assets/images/jiankong01.png'),
          html: '打开萤石云开放平台，点击“注册”按钮进入注册页面',
          count: 1
        },
        {
          url: require('../../../assets/images/jiankong02.png'),
          html: '根据提示，完成注册信息填写，应用名称之类的信息随便填写就可以了',
          count: 2
        },
        {
          url: require('../../../assets/images/jiankong03.png'),
          html: '注册成功后进入个人信息页面，打开”我的账号“下的”应用信息“页面',
          count: 3
        },
        {
          url: require('../../../assets/images/jiankong04.png'),
          html: '将AppKey和Secret粘贴到对应的设置项中即可完成初始设置',
          count: 4
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      queryVideoSetting().then(res => {
        this.obj = res.data
      })
    },
    copyAddress() {
      const clipboard = new this.$clipboard('.copyBtn')
      clipboard.on('success', () => {
        this.$message({
          message: '复制成功',
          type: 'success'
        })
        // 释放内存
        clipboard.destroy()
      })
      clipboard.on('error', () => {
        this.$message({
          message: '复制失败',
          type: 'error'
        })
        // 释放内存
        clipboard.destroy()
      })
    },
    detail() {
      this.visible = true
    },
    save() {
      const { appKey, appSecret } = this.obj
      if (!appKey.trim() || !appSecret.trim()) {
        this.$message.error('信息不完整')
        return
      }
      updateVideoSetting({ appKey, appSecret }).then(res => {
        this.$message.success('操作成功')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
  margin-top: 16px;
  padding-bottom: 24px;
  background-color: #fff;

  .title-box {
    margin-top: 16px;
    display: flex;
    align-items: center;

    .title {
      color: $title-color;
    }
  }

  .el-col {
    display: flex;
    align-items: center;
    margin-top: 15px;

    &.second-col {
      margin-top: 32px;
    }

    &.el-col-two {
      margin-top: 36px;
    }

    &.el-col-btn {
      padding-left: 42px;
    }

    .title {
      margin-left: 10px;
      font-weight: bold;
      @include c_title_color();
    }

    .col-item {
      padding-left: 42px;
    }

    .input-box {
      margin: 12px 0 8px;

      ::v-deep {
        .el-input {
          width: 480px;
        }
      }
    }

    .el-button {
      & + .el-button {
        margin-left: 8px;
      }
    }

    .btn-box {
      margin-top: 15px;
    }
  }

  .tutorial11 {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 2001;
    background-color: rgba(0, 0, 0, .5);
    display: flex;
    align-items: center;
    justify-content: center;

    ::v-deep {
      .el-carousel {
        width: 80%;
        height: 150%;

        .el-carousel__item {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }

    .close {
      position: absolute;
      right: 20px;
      top: 20px;
      font-size: 24px;
      width: 40px;
      height: 40px;
      color: $white;
      display: flex;
      align-items: center;
      justify-content: center;
      -webkit-border-radius: 50%;
      -moz-border-radius: 50%;
      border-radius: 50%;
      cursor: pointer;
      z-index: 9999;
    }
  }

  .tutorial {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1111;
    background-color: rgba(0, 0, 0, 0.7);

    .carouselBox {
      position: relative;
      top: 50%;
      margin: 0 auto;
      width: 1200px;
      transform: translateY(-50%);

      .innerBox {
        position: relative;
        margin: 0 auto;
        padding: 40px 0;
        width: 880px;
        height: 570px;
        text-align: center;
        background-color: $white;
        border-radius: 4px;

        .closeIcon {
          position: absolute;
          top: 15px;
          right: 15px;
          color: $secondary-color;
          font-weight: bold;
          cursor: pointer;

          &:hover {
            @include c_main_color();
          }
        }

        .count {
          .currentCount {
            font-size: 20px;
            @include c_main_color();
          }

          .total {
            font-size: 16px;
            color: $secondary-color;
          }
        }

        .explanation {
          display: inline-block;
          margin: 30px auto 0;
          max-width: 640px;
          color: $title-color;
          text-align: left;

          .bold {
            font-weight: bold;
          }
        }

        .imgBox {
          margin: 50px auto 0;
          width: 674px;
          height: 325px;

          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        }
      }

      ::v-deep .el-carousel__item {
        background-color: transparent;
      }

      ::v-deep .el-carousel__indicators {
        display: none;
      }

      ::v-deep .el-carousel__arrow {
        border: 2px solid rgba(255, 255, 255, 0.8);

        &:hover {
          border-color: $white;

          i {
            color: $white;
          }
        }

        i {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }
  }
}
</style>
