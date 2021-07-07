<template>
  <div class="parentDrawer-wrap">
    <etm-layout-split>
      <etm-title :show-line="false" :border="true" size="big">
        <template v-if="!editOn">
          {{ childName }}的家长
        </template>
        <template v-else>
          {{ formData.parentName }}({{ transferRelation(formData.relationship) }})
          <template slot="tool">
            <el-button plain size="mini" @click="cancel">取消</el-button>
            <el-button type="primary" size="mini" @click="save">保存</el-button>
          </template>
        </template>
      </etm-title>
      <div class="parentContent">
        <div v-if="!editOn" class="parentList">
          <div v-for="(list, index) in parentList" :key="index" class="parentItem">
            <div class="parentBox">
              <div class="avatarBox">
                <div v-if="list.avatar" class="img">
                  <img :src="list.avatar">
                </div>
                <span v-else class="iconfont iconmorentouxiang" />
              </div>
              <div class="name">
                {{ list.parentName }}({{ transferRelation(list.relationship) }})
                <span class="iconfont iconedit1" @click="edit(list)" />
              </div>
              <div class="msgBox">
                <div class="inner">
                  <div class="label rightLine">
                    <span class="iconfont iconmobile" />
                    家长手机
                  </div>
                  <div class="text">{{ list.telephone }}</div>
                </div>
                <div class="inner">
                  <div class="label">
                    <span class="iconfont iconcreditcard" />
                    接送卡号
                    <el-dropdown v-if="list.attendanceCardNumber">
                      <span class="el-dropdown-link">
                        <i class="el-icon-arrow-down el-icon--right" />
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="reBund(list)">解绑</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                  <div class="text">{{ list.attendanceCardNumber || '--' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="formList">
          <etm-form type="dialog">
            <el-form-item label="头像">
              <etm-upload-avatar
                v-model="formData.avatar"
                :resource-name="'guardcare/parent'"
                media-type="image"
                @success="success"
              />
            </el-form-item>
            <el-form-item label="家长手机">
              <el-input v-model="formData.telephone" placeholder="请输入手机号码" />
            </el-form-item>
            <el-form-item>
              <span slot="label">
                <el-tooltip effect="light" popper-class="stepTips" :visible-arrow="false" placement="bottom-start">
                  <span>接送卡号<i class="iconfont iconquestion-circle" /></span>
                  <div slot="content" class="contactTip">
                    <b>接送卡号输入方式一：</b>
                    <div>1.将接送卡读卡器与电脑连接。</div>
                    <div>2.将鼠标光标放置卡号输入框内。</div>
                    <div>3.将接送卡在读卡器刷卡，卡号成功输入。</div>
                    <b>接送卡号输入方式二：</b>
                    <div>手动输入接送卡号</div>
                  </div>
                </el-tooltip>
              </span>
              <el-input v-model="formData.attendanceCardNumber" placeholder="请输入接送卡号" />
            </el-form-item>
          </etm-form>
        </div>
      </div>
    </etm-layout-split>
  </div>

</template>

<script>/**
 * parentDrawer create by Administrator
 * createTime 2020/11/4 18:12
 */

import {
  delAttendanceCard,
  getParentById,
  getParentListByChildId,
  renewParent
} from '@/api/guardcare/childManage/childManage'
import EtmUploadAvatar from '@/components/EtmUploadAvatar/index'

export default {
  name: 'ParentDrawer',
  components: {
    EtmUploadAvatar
  },
  filters: {},
  mixins: [],
  props: {
    childId: {
      type: Number,
      default() {
        return null
      }
    },
    childName: {
      type: String,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      parentList: [],
      editOn: false,
      formData: {}
    }
  },
  computed: {},
  watch: {
    childId() {
      this.getList()
    }
  },
  created() {
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      const param = {
        childId: this.childId
      }
      getParentListByChildId(param).then(res => {
        this.parentList = res.data.content
      })
    },
    transferRelation(relation) {
      // MOTHER :妈妈 FATHER :爸爸 GRANDFATHER :爷爷 GRANDMOTHER :奶奶 GRANDPA :外公 GRANDMA :外婆 OTHER :其他
      switch (relation) {
        case 'MOTHER':
          return '妈妈'
        case 'FATHER':
          return '爸爸'
        case 'GRANDFATHER':
          return '爷爷'
        case 'GRANDMOTHER':
          return '奶奶'
        case 'GRANDPA':
          return '外公'
        case 'GRANDMA':
          return '外婆'
        case 'OTHER':
          return '其他'
        default:
          return relation
      }
    },
    edit(data) {
      const param = {
        parentId: data.parentId,
        childId: this.childId
      }
      getParentById(param).then(res => {
        this.formData = res.data
        this.editOn = true
      })
    },
    cancel() {
      this.editOn = false
    },
    save() {
      const param = {
        parentId: this.formData.parentId,
        childId: this.childId,
        telephone: this.formData.telephone,
        attendanceCardNumber: this.formData.attendanceCardNumber,
        avatar: this.formData.avatar
      }
      renewParent(param).then(() => {
        this.$message.success('修改成功！')
        this.editOn = false
        this.getList()
      })
    },
    reBund(data) {
      const html = `是否继续解绑<span class="mainColor">` + data.parentName + `</span>的接送卡？`
      this.$etmTip.init({
        type: 'warn',
        title: `确认`,
        html,
        confirmBtn: '解绑',
        cancelBtn: '取消',
        cancel: () => {
          this.$etmTip.close()
        },
        confirm: () => {
          const param = {
            childId: this.childId,
            parentId: data.parentId
          }
          delAttendanceCard(param).then(() => {
            this.$etmTip.close()
            this.$message.success('解绑成功！')
            this.getList()
          })
        }
      })
      this.$etmTip.open()
    },
    success(hash, key) {
      this.formData.avatar = key
    }
  }
}
</script>
<style lang="scss" scoped>
.parentDrawer-wrap {
  .parentContent {
    padding: 0 14px;

    .parentList {
      .parentItem {
        padding-top: 36px;

        & + .parentItem {
          margin-top: 24px;
        }

        .parentBox {
          position: relative;
          padding: 32px 0;
          text-align: center;
          border: 1px solid;
          @include bc_divide_color();
          border-radius: 10px;

          .avatarBox {
            position: absolute;
            top: -36px;
            left: 0;
            right: 0;
            margin: 0 auto;
            width: 58px;
            height: 58px;
            border-radius: 50%;
            @include bgc_white();
            overflow: hidden;

            .img {
              width: 58px;
              height: 58px;

              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
            }

            .iconfont {
              width: 58px;
              height: 58px;
              line-height: 58px;
              font-size: 58px;
              @include c_disabled_color();
            }
          }

          .name {
            font-size: 16px;
            @include c_title_color();

            .iconfont {
              @include etm-color();
              cursor: pointer;

              &:hover {
                opacity: .8;
              }
            }
          }
        }

        .msgBox {
          display: flex;
          margin-top: 24px;

          .inner {
            width: 50%;

            .label {
              position: relative;
              @include c_secondary_color();

              &.rightLine {
                &::after {
                  display: inline-block;
                  position: absolute;
                  right: 0;
                  top: 12px;
                  content: '';
                  width: 1px;
                  height: 26px;
                  background-color: #ddd;
                }
              }

              .iconfont {
                width: 16px;
                font-size: 14px;
              }

              ::v-deep .el-dropdown {
                position: absolute;
                top: 0;
                right: 32px;

                .el-icon-arrow-down {
                  font-size: 12px;
                }
              }
            }

            .text {
              margin-top: 8px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
      }
    }
  }
}

.contactTip {
  b {
    line-height: 24px;
    @include c_secondary_color();
  }

  div {
    line-height: 21px;
    @include c_secondary_color();
  }
}
</style>
