<template>
  <div class="departmentList">
    <div class="conTop" :class="multipleOn ? 'multipleOn' : ''">
      <div class="compName textLeft">
        <div @click="getFirstOrg()">{{ organization.name }}</div>
        <div v-for="(item,index) in levelList" :key="index">
          <span class="iconfont iconright" />
          <span @click="getPrevOrg(item.id,index)">{{ item.name }}</span>
        </div>
      </div>
      <div class="container">
        <div class="scrollBox">
          <div v-if="deptList.length" class="department">
            <com-dept-list
              :dept-list="deptList"
              @nextOrganization="nextLeviOrganization"
            />
          </div>
          <div v-if="employeeList.length" class="user">
            <van-checkbox-group v-model="result" checked-color="#10C2C4">
              <template v-for="(item,index) in employeeList">
                <universal-card
                  :key="index"
                  :multiple="multipleOn"
                  :index="item.id"
                  :name="item.name"
                  :icon="item.avatar"
                  @click.native="confirmChoose(item)"
                >
                  <div class="van-ellipsis">
                    {{ getRole(item.positionNameList) }}
                  </div>
                </universal-card>
              </template>
            </van-checkbox-group>
          </div>
        </div>
        <div v-if="!deptList.length&&!employeeList.length" class="noMarket">
          <no-content message="该部门暂无员工" />
        </div>
      </div>
      <div v-show="hidshow" class="bottomFixed">
        <div class="bottomBtn notBottomBar van-hairline--top">
          <div class="btn" @click="cancel">
            <control-btn text="取消" type="cancel" />
          </div>
          <div v-if="multipleOn" class="btn" @click="save">
            <control-btn
              :text="dataResult.length? '确定(已选'+dataResult.length+'人)' : '确定'"
              type="primary"
              :disabled="!dataResult.length"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import comDeptList from '../../../components/common/comDeptList'
import universalCard from '../../../components/common/universalCard'
import controlBtn from '../../../components/common/controlBtn'
import noContent from '../../../components/common/noContent'
import {
  getEmployee, getDepartmentTreeById
} from '../../../service/base/contact'
import { getOrgMsg } from '../../../js/organization'

export default {
  name: 'DepartmentList',
  components: {
    comDeptList,
    universalCard,
    controlBtn,
    noContent
  },
  props: {
    multipleOn: {
      type: Boolean,
      default() {
        return false
      }
    },
    adviserData: {
      type: Array,
      default() {
        return []
      }
    },
    customerCount: {
      type: Number,
      default() {
        return null
      }
    },
    allocationType: {
      type: String,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      deptList: [],
      employeeList: [],
      searchValue: '',
      result: [],
      dataResult: [],
      organization: {},
      levelList: [],
      organizationId: ''
    }
  },
  computed: {
    hidshow() {
      return this.$store.state.show.showBottom
    }
  },
  created() {
    if (this.adviserData) {
      for (let i = 0; i < this.adviserData.length; i++) {
        this.result.push(this.adviserData[i].id)
        this.dataResult.push(this.adviserData[i])
      }
    }
    this.organization = getOrgMsg()
    this.organizationId = this.organization.id
    this.getMarket(this.organizationId)
  },
  methods: {
    getRole(list) {
      if (!list || !list.length) return null
      let role = ''
      list.forEach((item, index) => {
        if (index === 0) {
          role += item
        } else {
          role += '/' + item
        }
      })
      return role
    },
    getMarket(id) {
      // 获取市场人员
      getDepartmentTreeById(id).then(response => {
        const markrtList = response.data.data
        if (markrtList.length) {
          this.deptList = response.data.data
          const data = {}
          data.organizationIds = []
          this.deptList.forEach(dept => {
            data.organizationIds.push(dept.id)
          })
        }
      })
      // 获取到该组织下的所有员工，格式化成组件数据结构渲染
      const param = {
        organizationId: id,
        recursiveSearch: false,
        paged: false
      }
      getEmployee(param).then(res => {
        const employeeList = res.data.data.content
        if (employeeList) {
          this.employeeList = employeeList
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
      this.deptList = []
      this.employeeList = []
      this.getMarket(this.organizationId)
    },
    confirmChoose(data) {
      if (!this.multipleOn) {
        this.$emit('marketConfirm', data)
      } else {
        if (this.result.indexOf(data.id) === -1) {
          if (this.allocationType === 'AVERAGE') {
            if (this.result.length < this.customerCount) {
              this.result.push(data.id)
              this.dataResult.push(data)
            } else {
              this.$toast({
                message: '平均分配时顾问数量不能多于客户数量',
                duration: 1000,
                icon: 'icon iconfont iconwarning'
              })
            }
          } else {
            this.result.push(data.id)
            this.dataResult.push(data)
          }
        } else {
          this.result.splice(this.result.indexOf(data.id), 1)
          this.dataResult.splice(this.result.indexOf(data.id), 1)
        }
      }
    },
    // 搜索方法
    searchEmployee() {
      const param = {
        organizationId: this.organizationId,
        keyword: this.searchValue,
        paged: false
      }
      // 搜索员工
      getEmployee(param).then(res => {
        this.employeeList = res.data.data.content
      })
    },
    cancel() {
      this.$emit('marketConfirm')
    },
    save() {
      this.$emit('marketConfirm', this.dataResult)
    }
  }
}
</script>

<style lang="scss" scoped>

    .departmentList {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1111;
        background-color: $bg-5;
    }

    .conTop {
        .compName {
            padding: 20px 12px;
            font-size: 13px;
            color: $text-5;
            background-color: $white;
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

        .container {
            height: calc(100vh - 125px);
            overflow-y: scroll;

            .scrollBox {
                padding-bottom: 12px;

                .department {
                    margin-top: 12px;
                    background-color: $white;
                }

                .user {
                    margin-top: 12px;
                }
            }

            .noMarket {
                padding-top: 100px;
                height: calc(100% - 12px);
                background-color: $white;
            }
        }
    }
</style>
