<template>
  <div class="applyItem" :class="{hasBottomLine: bLine=='long'}">
    <div class="applyFix">
      <el-avatar :size="60" icon="el-icon-user-solid" @click.stop="applyDetailControl" />
    </div>
    <div class="applyInfo" :class="{hasBottomLine: bLine=='short'}">
      <div class="applyInfoTxt" @click.stop="applyDetailControl">
        <p class="applyInfoTxtTitle">
          <span class="applyInfoTxtName">{{ applyList.appName }}</span>

          <span v-if="terminalFlag">
            <!--            <span v-for="(item,index) in applyList.terminal" :key="index" class="applyInfoTxtType" :class="{applyInfoTxtTypeC: item === '移动端'}">{{ item }}</span>-->
            <span class="applyInfoTxtType" :class="{applyInfoTxtTypeC: applyList.type === 'MOBILE'}">{{ applyList.type }}</span>
          </span>
        </p>
        <p v-if="applyList.developerName" class="applyInfoTxtOrg">
          服务商：{{ applyList.developerName }}
        </p>
        <p class="applyInfoTxtDetail">
          <span :class="{'applyDesc': ellipsisIntro}">
            {{ applyList.appDescription }}
          </span>
          <span class="applyDescMark">详情></span>
        </p>
      </div>
      <el-button v-if="btnText" :style="{'background': btnColor}" @click.stop="applyControl()">{{ btnText }}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ApplyList',
  props: ['applyList', 'btnText', 'bottomLine', 'ellipsisIntro', 'terminalFlag'],
  data() {
    return {

    }
  },
  computed: {
    bLine() {
      return this.bottomLine ? this.bottomLine : false
    },
    btnColor() {
      if (this.btnText === '安装') {
        return '#8457f2'
      } else if (this.btnText === '已安装') {
        return '#CCCCCC'
      } else {
        return '#F5222D'
      }
    }
  },

  methods: {
    applyDetailControl() {
      this.$emit('applyDetailControl')
    },
    applyControl() {
      this.$emit('applyControl')
    }
  }
}
</script>

<style lang="scss" scoped>
  .hasBottomLine{
    border-bottom: 1px solid $divide-color;
  }
  .applyItem{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 24px;

    .applyInfo{
      display: flex;
      align-items: center;
      flex: 1;
      overflow: hidden;
      margin-left: 26px;

      .applyInfoTxt{
        flex: 1;
        overflow: hidden;
        cursor: pointer;
        .applyInfoTxtTitle{
          display: flex;
          align-items: center;
          .applyInfoTxtName{
            font-size:16px;
            font-weight:400;
            @include c_title_color();
          }
          .applyInfoTxtType{
            font-size: 12px;
            @include c_main_color();
            //color: $main-color;
            padding: 5px;
            background: #FFF4E8;
            border-radius:2px;
            margin-left: 15px;
          }
          .applyInfoTxtTypeC{
            color: $info-color;
            background: $info-light-color;
          }

        }

        .applyInfoTxtDetail{
          font-size:14px;
          font-weight:400;
          display: flex;
          .applyDesc{
            max-width: 50%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            @include c_secondary_color();
          }
          .applyDescMark{
            display: none;
            @include c_main_color();
          }

        }
        .applyInfoTxtOrg{
          font-size:14px;
          @include c_secondary_color();
        }

      }

    }
    &:hover{
       background: $hover-color;
      .applyInfo{
        .applyInfoTxtTitle{
          @include c_main_color();
        }
      }

    }
  }
</style>
