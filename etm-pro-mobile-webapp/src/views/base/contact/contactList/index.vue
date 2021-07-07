<template>
  <div class="contactList">
    <div class="conTop">
      <van-search
        v-model="searchValue"
        placeholder="输入员工姓名或手机号码搜索"
        @search="onSearch"
      />
      <div class="title textLeft">
        公司组织架构
      </div>
      <div class="companyCard" @click="toCompony">
        <div class="left img">
          <img v-if="organization.logo" :src="organization.logo">
          <div v-else class="noImg" />
        </div>
        <div class="left companyName">{{ organization.name }}</div>
        <div class="right"><span class="iconfont iconright" /></div>
      </div>
    </div>
    <div class="conBottom">
      <div class="title textLeft">
        我的部门
      </div>
      <div class="departmentCard" @click="toDepartment">
        <div class="left icon">
          <span class="iconfont iconrenyuan" />
        </div>
        <div class="left department">{{ department.name }}</div>
        <div class="right"><span class="iconfont iconright" /></div>
      </div>
    </div>
  </div>
</template>

<script>
import { getOrgMsg } from '../../../../js/organization'
import { removeSession, setSession } from '../../../../js/common'
import { getDeptLevel } from '../../../../service/base/contact'
import { replaceSpace } from '../../../../js/rules'

export default {
  name: 'ContactList',
  data() {
    return {
      organization: {},
      departmentList: [],
      department: {},
      searchValue: ''
    }
  },
  created() {
    // 获取当前操作的组织机构
    this.$store.commit('contact/SET_VALUE', null)
    this.organization = getOrgMsg()
    this.getDepartment()
  },
  methods: {
    toCompony() {
      // 清除组织面包屑数据缓存
      removeSession('levelList')
      // 跳转至组织机构员工列表页
      this.$router.replace({
        path: '/contact'
      })
    },
    getDepartment() {
      getDeptLevel().then(res => {
        const list = res.data.data.organizationList
        if (list) {
          if (list.length > 1) {
            list.splice(0, 1)
            let name = ''
            list.forEach((item, index) => {
              if (index === list.length - 1) {
                name += item.organizationName
              } else {
                name += item.organizationName + '-'
              }
              const data = {
                name: item.organizationName,
                id: item.organizationId
              }
              this.departmentList.push(data)
            })
            this.department = {
              name: name
            }
          } else {
            this.department = {
              name: list[0].organizationName
            }
          }
        } else {
          this.department = this.organization
        }
      })
    },
    toDepartment() {
      setSession('levelList', this.departmentList)
      this.$router.replace({
        path: '/contact'
      })
    },
    onSearch() {
      this.searchValue = replaceSpace(this.searchValue)
      if (this.searchValue) {
        // 清除组织面包屑数据缓存
        removeSession('levelList')
        // vuex存储搜索关键字
        this.$store.commit('contact/SET_VALUE', this.searchValue)
        this.$router.replace({
          path: '/contact'
        })
      }
    }
  }
}
</script>

<style lang="scss">
    .contactList {
        .conTop {
            background-color: $white;

            .companyCard {
                padding: 15px 12px;
                overflow: hidden;

                .img {
                    @include round(40px);
                    overflow: hidden;

                    .noImg {
                        @include wh(100%, 100%);
                        background-color: $text-d;
                    }
                }

                .companyName {
                    margin-left: 12px;
                    line-height: 40px;
                    font-size: 17px;
                }
            }
        }

        .conBottom {
            margin-top: 12px;
            background-color: $white;

            .title {
                padding-top: 20px;
            }

            .departmentCard {
                padding: 15px 12px;
                overflow: hidden;

                div {
                    height: 30px;
                    line-height: 30px;
                }

                .icon {

                    .iconrenyuan {
                        font-size: 20px;
                        color: $blue;
                    }
                }

                .department {
                    margin-left: 12px;
                    max-width: 280px;
                    font-size: 15px;
                    white-space: nowrap;
                    overflow-x: auto;
                }
            }

        }

        .title {
            padding: 10px 12px 0;
            color: $text-6;
            font-size: 13px;
        }

        .right {
            line-height: 38px;

            .iconright {
                font-size: 12px;
                color: $text-b;
            }
        }
    }
</style>
