<template>
  <div class="contact">
    <div class="conTop van-hairline--bottom">
      <van-search
        v-model="searchValue"
        placeholder="输入员工姓名或手机号码搜索"
        @search="searchEmployee"
        @clear="closeSearch"
      />
      <div ref="compName" class="compName textLeft">
        <div>
          <div @click="getFirstOrg()">{{ organization.name }}</div>
          <div v-for="(item,index) in levelList" :key="index">
            <span class="iconfont iconright" />
            <span @click="getPrevOrg(item.id,index)">{{ item.name }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="scrollBox" :class="!hidshow ? 'hidShow' : ''">
      <div v-if="deptList.length" class="department">
        <com-dept-list :dept-list="deptList" @nextOrganization="nextLeviOrganization" />
      </div>
      <div v-if="employeeList.length" class="user">
        <template v-for="(item,index) in employeeList">
          <universal-card
            :key="index"
            :name="item.name"
            :icon="item.avatar"
            :search-value="value"
            @click.native="toDetail(item.id)"
          >
            <span :class="item.positionNameList && item.positionNameList.length ? '' : 'noPost'">
              {{ getEmployeePosition(item.positionNameList) }}
            </span>
          </universal-card>
        </template>
      </div>
      <div
        v-if="!deptList.length && !employeeList.length"
        class="noContact"
        :class="!hidshow ? 'hidShow' : ''"
      >
        <no-content :message="searchValue ? '搜索结果为空' : '该部门暂无员工'" />
      </div>
    </div>
  </div>
</template>

<script>
import comDeptList from '../../../../components/common/comDeptList'
import universalCard from '../../../../components/common/universalCard'
import noContent from '../../../../components/common/noContent'
import {
  getDepartmentTreeById,
  getEmployee
} from '../../../../service/base/contact'
import { getOrgMsg } from '../../../../js/organization'
import { getSession, removeSession, setSession } from '../../../../js/common'
import { replaceSpace } from '../../../../js/rules'

export default {
  name: 'Contact',
  components: {
    comDeptList,
    universalCard,
    noContent
  },
  inject: ['reload'],
  data() {
    return {
      deptList: [],
      employeeList: [],
      organization: {},
      organizationId: '',
      searchValue: '',
      value: '',
      searchOn: false,
      pageSize: 15,
      pageNum: 0,
      levelList: []
    }
  },
  computed: {
    hidshow() {
      return this.$store.state.show.showBottom
    }
  },
  created() {
    this.organization = getOrgMsg()
    this.organizationId = this.organization.id
    const value = this.$store.state.contact.searchValue
    if (value) {
      this.searchValue = value
      this.value = value
      this.searchEmployee()
    } else {
      const levelList = getSession('levelList')
      if (levelList && levelList.length) {
        this.levelList = levelList
        this.organizationId = this.levelList[this.levelList.length - 1].id
      }
      this.getNextOrganization()
      this.getEmployeeList()
      this.scroll()
    }
  },
  mounted() {
    // 如果支持 popstate 一般移动端都支持了
    if (window.history && window.history.pushState) {
      // 往历史记录里面添加一条新的当前页面的url
      history.pushState(null, null, document.URL)
      // 给 popstate 绑定一个方法 监听页面刷新
      window.addEventListener('popstate', this.backChange, false)// false阻止默认事件
    }
  },
  destroyed() {
    window.removeEventListener('popstate', this.backChange, false)// false阻止默认事件
  },
  methods: {
    getNextOrganization() {
      getDepartmentTreeById(this.organizationId).then(treeList => {
        const deptList = treeList.data.data
        if (deptList) {
          for (let i = 0; i < deptList.length; i++) {
            this.deptList.push(deptList[i])
          }
        }
      })
    },
    getFirstOrg() {
      if (this.levelList.length) {
        this.levelList = []
        this.organizationId = this.organization.id
        this.loadAgain()
      }
    },
    getPrevOrg(id, index) {
      if (index !== (this.levelList.length - 1)) {
        this.levelList.splice(index + 1)
        this.organizationId = id
        this.loadAgain()
      }
    },
    // 点击部门下一级的子部门
    nextLeviOrganization(organization) {
      this.organizationId = organization.id
      this.levelList.push(organization)
      this.loadAgain()
    },
    loadAgain() {
      setSession('levelList', this.levelList)
      if (!this.levelList.length) removeSession('levelList')
      this.searchOn = false
      this.searchValue = null
      this.value = null
      this.$store.commit('contact/SET_VALUE', null)
      this.pageNum = 0
      this.deptList = []
      this.employeeList = []
      this.getNextOrganization()
      this.getEmployeeList()
      this.scroll()
    },
    scroll() {
      this.$nextTick(() => {
        const width = this.$refs.compName.children[0].clientWidth - this.$refs.compName.clientWidth + 24
        if (width > 0) {
          this.$refs.compName.scrollLeft = width
        }
      })
    },
    // 获取员工职位
    getEmployeePosition(postList) {
      let Position = ''
      if (postList) {
        const postLen = postList.length
        if (postLen > 0) {
          for (let i = 0; i < postLen; i++) {
            if (i === 0) {
              Position += postList[i]
            } else {
              Position += '、' + postList[i]
            }
          }
        } else {
          Position = '暂无岗位'
        }
      } else {
        Position = '暂无岗位'
      }
      return Position
    },
    // 搜索方法
    searchEmployee() {
      this.searchValue = replaceSpace(this.searchValue)
      if (this.searchValue) {
        this.$store.commit('contact/SET_VALUE', this.searchValue)
        this.searchOn = true
        this.value = this.searchValue
        this.deptList = []
        const param = {
          organizationId: this.organizationId,
          keyword: this.searchValue,
          paged: false
        }
        // 搜索员工
        getEmployee(param).then(res => {
          this.employeeList = res.data.data.content
        })
      } else {
        this.loadAgain()
      }
    },
    closeSearch() {
      this.loadAgain()
    },
    getEmployeeList() {
      if (!this.searchOn) {
        const param = {
          organizationId: this.organizationId,
          recursiveSearch: false,
          paged: false
        }
        getEmployee(param).then(res => {
          const employeeList = res.data.data.content
          if (employeeList) {
            this.employeeList = employeeList
          }
        })
      }
    },
    backChange() {
      if (this.levelList.length) {
        this.levelList.splice((this.levelList.length - 1), 1)
        if (this.levelList.length) {
          this.organizationId = this.levelList[this.levelList.length - 1].id
        } else {
          this.organizationId = this.organization.id
        }
        setSession('levelList', this.levelList)
        this.reload()
      } else {
        removeSession('levelList')
        this.$router.replace({
          path: '/contactList'
        })
      }
    },
    toDetail(id) {
      setSession('levelList', this.levelList)
      this.$router.push({
        path: '/colleaguesDetails',
        query: {
          id: id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

    .contact {

        .conTop {
            background-color: $white;

            .compName {
                padding: 10px 12px 15px;
                font-size: 13px;
                color: $text-5;
                overflow-x: auto;
                white-space: nowrap;

                div {
                    display: inline-block;

                    &:not(:last-child) {
                        color: $text-9;
                    }

                    .iconright {
                        margin: 0 3px;
                        font-size: 12px;
                        color: $text-b;
                    }
                }
            }
        }

        .scrollBox {
            padding: 12px 0 0;
            max-height: calc(100vh - 146px);
            overflow-y: auto;

            &.hidShow {
                max-height: calc(100vh - 96px);
            }

            .user {
                margin-bottom: 12px;

                .noPost {
                    color: $text-9;
                }
            }
        }

        .department {
            margin-bottom: 12px;
            background-color: $white;
        }

        .noContact {
            padding-top: 100px;
            height: calc(100vh - 158px);
            background-color: $white;

            &.hidShow {
                height: calc(100vh - 108px);
            }
        }
    }
</style>
