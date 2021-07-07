<template>
  <div class="info">
    <div class="avatar">
      <el-avatar icon="el-icon-user-solid" :size="72" :src="avatar" />
      <p>{{ memberName }}</p>
    </div>
    <div class="wrap">
      <div class="contact">
        <Etm-title>{{ $t('memberManage.detailInfoTitleContact') }}</Etm-title>
        <ul v-if="contacts && contacts.length > 0">
          <li v-for="(contact, index) in contacts" :key="index">
            <span>
              {{ contact.name }}（{{ contact.contactName }}）
            </span>
            <span>
              <i class="iconfont">&#xe667;</i>
              {{ contact.phone }}
            </span>
          </li>
        </ul>
      </div>
      <div class="information">
        <Etm-title>{{ $t('memberManage.detailInfoTitleInfomation') }}</Etm-title>
        <ul v-if="information && information.length > 0">
          <li v-for="(info, index) in information" :key="index">
            {{ info.name }} : {{ info.textValue ? info.textValue : $t('memberManage.unknownText') }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { getDateObj } from '../util'
export default {
  props: {
    // eslint-disable-next-line vue/require-default-prop
    content: {
      type: Object
    }
  },
  data() {
    return {
      memberName: '会员姓名',
      avatar: '',
      contacts: [],
      information: []
    }
  },
  watch: {
    content(v) {
      // 设置会员姓名、头像、会员信息
      if (Array.isArray(v.attributes)) {
        this.information = []
        v.attributes.forEach(v => {
          switch (v.name) {
            case '姓名':
              this.memberName = v.textValue
              break
            case '头像':
              this.avatar = v.textValue ? v.textValue : ''
              break
            case '出生日期':
              // eslint-disable-next-line no-case-declarations
              const dateObj = getDateObj(v.dateValue)
              this.information.push({
                name: '出生日期',
                textValue: `${dateObj.year}-${dateObj.month}-${dateObj.day}`
              })
              break
            case '性别':
              this.information.push({
                name: '性别',
                textValue: v.textValue === '1' ? '女' : '男'
              })
              break
            default:
              this.information.push({
                name: v.name,
                textValue: v.textValue
              })
          }
        })
        if (v.area) {
          this.information.push({
            name: '地区',
            textValue: v.area.provinceName + v.area.cityName + v.area.countyName
          })
        }
      }

      // 设置联系人
      if (Array.isArray(v.contacts)) {
        this.contacts = v.contacts
      }
    }
  }
}
</script>

<style scoped lang="scss">
.info {
  ul, li {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  overflow-y: auto;
  width: 344px;
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
  .EtmTitle-wrap {
    margin-bottom: 0;
  }
}
</style>
