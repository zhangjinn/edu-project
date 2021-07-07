<template>
  <div class="info">
    <div class="avatar">
      <el-avatar icon="el-icon-user-solid" :size="72" :src="avatar" />
      <p>{{ name }}</p>
    </div>
    <div class="wrap">
      <div class="contact">
        <Etm-title>{{ $t('memberManage.detailInfoTitleContact') }}</Etm-title>
        <ul v-if="contacts && contacts.length > 0">
          <li v-for="(contact, index) in contacts" :key="index">
            <span>
              {{ contact.name }}（{{ contact.relationship }}）
            </span>
            <span>
              <i class="iconfont">&#xe667;</i>
              {{ contact.telephone }}
            </span>
          </li>
        </ul>
      </div>
      <div class="information">
        <Etm-title>{{ $t('memberManage.detailInfoTitleInfomation') }}</Etm-title>
        <ul v-if="information && information.length > 0">
          <li v-for="(info, index) in information" :key="index">
            {{ info.name }} : {{ info.textValue }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    // eslint-disable-next-line vue/require-default-prop
    content: {
      type: Object
    },
    name: {
      type: String,
      default: '会员姓名'
    }
  },
  data() {
    return {
      avatar: '',
      contacts: [],
      information: [],
      matchList: {
        gender: '性别',
        birthday: '出生日期',
        monthAge: '月龄',
        enterSchoolTime: '入园时间',
        schoolName: '上课园区',
        totalHour: '总课时',
        leftTotalHour: '剩余课时',
        payHour: '付费课时',
        giveHour: '赠送课时',
        leftPayHour: '付费剩余课时',
        leftGiveHour: '赠送剩余课时',
        supplementHour: '需补课课时',
        usedSupplementHour: '已补课课时',
        leftSupplementHour: '剩余补课课时'
      }
    }
  },
  watch: {
    content: {
      handler(v) {
        if (!v) return
        if (v.customerInfo) {
          this.avatar = v.customerInfo.avatar
          for (const k in this.matchList) {
            this.information.push({
              name: this.matchList[k],
              textValue: v.customerInfo[k]
            })
          }
        }

        if (Array.isArray(v.parentInfoList)) {
          this.contacts = v.parentInfoList
        }
      },
      immediate: true
    }
  }
}
</script>

<style scoped lang="scss">
.info {
  width: 100%;
  ul, li {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  margin-right: 16px;
  @include bgc_white();
  & >>> .EtmTitle-wrap .text {
    border: none
  }
  .avatar {
    text-align: center;
    padding-top: 28px;
    p {
      margin: 16px 0 24px;
      @include c_text_color();
    }
    & >>> .el-avatar {
      img {
        width: 100%;
      }
    }
  }
  .wrap {
    height: calc(100vh - 226px);
    overflow-y: auto;
  }
  .contact, .information {
    @include c_text_color();
    font-size: 14px;
  }
  .contact {
    ul {
      padding: 0 24px;
      transform: translateY(-12px);
      li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        line-height: 46px;
        border-bottom: 1px solid;
        @include bc_divide_color();
        i {
          font-size: 14px;
        }
      }
    }
  }
  .information {
    ul {
      padding: 0 24px;
      li {
        line-height: 34px;
      }
    }
  }
}
</style>
