<template>
  <div class="nestingTable-wrap">
    <div class="row row-title">
      <div
        v-for="(item, index) in columns"
        :key="index"
        class="col col-header"
        :style="{width : item.width || '30%'}"
      >
        {{ item.label }}
      </div>
      <div class="col delete" />
    </div>
    <div v-if="data.length" class="row-body">
      <div
        v-for="(item, index) in data"
        :key="index"
        class="box"
      >
        <div class="row">
          <div
            v-for="(i, k) in columns"
            :key="k"
            class="col"
            :style="{width : i.width || '30%'}"
          >

            <template v-if="k === 0">
              <!--              <div v-if="showImg" class="itemImg">-->
              <!--                <img src="../../../../assets/images/etm-logo.png">-->
              <!--              </div>-->
              <el-image
                v-if="showImg && data[index][map['img']] && data[index][map['img']] !== '--'"
                class="itemImg"
                fit="cover"
                :src="data[index][map['img']]"
                alt=""
              />
              <div v-else class="itemImg">
                <img src="../../../../assets/images/etm-logo-contract.png">
              </div>

              <div :style="{flex:1, textAlign: 'left'}">
                {{ data[index][map['name']] }}
              </div>
            </template>

            <template v-if="!item[map['childList']] && k === 1">
              <div class="input">实收：
                <div
                  :style="{
                    width: (disable && normal && !item[map['modify']]) ? '100px' : 'auto'}"
                >
                  <el-input
                    v-if="disable && normal && !item[map['modify']]"
                    v-model.trim="data[index][map['netReceipts']]"
                    size="mini"
                    @input="numberInput($event, [{index, key:'netReceipts'}])"
                    @blur="change(index, false)"
                  />
                  <p v-else>
                    ￥{{ data[index][map['netReceipts']] | toFixed }}
                  </p>
                </div>
              </div>
              <div class="input">应收：
                <div
                  :style="{
                    width: disable && status !== 'transfer' && normal && !item[map['modify']] ? '100px' : 'auto'
                  }"
                >
                  <el-input
                    v-if="disable && status !== 'transfer' && normal && !item[map['modify']]"
                    v-model="data[index][map['receivable']]"
                    size="mini"
                    @input="numberInput($event, [{index, key:'receivable'}])"
                    @blur="change(index, false)"
                  />
                  <p v-else>
                    ￥{{ data[index][map['receivable']] | toFixed }}
                  </p>
                </div>
              </div>
            </template>

            <template v-if="!item[map['childList']] && k === 2">
              <div class="input">
                {{ text }}购买：
                <div>
                  <el-input-number
                    v-if="disable"
                    v-model="data[index][map['purchase']]"
                    :min="0"
                    :max="status === 'transfer' ? data[index]['_' + map['purchase']] : 999999999"
                    size="mini"
                    @blur="numberChange(index, false)"
                    @change="numberChange(index, false)"
                  />
                  <p v-if="!disable">
                    {{ data[index][map['purchase']] }}
                  </p>
                </div>
              </div>

              <div v-if="status === 'transfer'" class="input especially">
                剩余购买：
                <div>{{ data[index]['_' + map['purchase']] }}</div>
              </div>

              <div class="input">{{ text }}赠送：
                <el-input-number
                  v-if="disable"
                  v-model="data[index][map['give']]"
                  :min="0"
                  :max="status === 'transfer' ? data[index]['_' + map['give']] : 999999999"
                  size="mini"
                  @blur="event => { if(!data[index][map['give']]) data[index][map['give']] = 0 }"
                />
                <p v-if="!disable">
                  {{ data[index][map['give']] }}
                </p>
              </div>

              <div v-if="status === 'transfer'" class="input especially">
                剩余赠送：
                <div>{{ data[index]['_' + map['give']] }}</div>
              </div>
            </template>

            <template v-if="k === 3">
              <div class="input">实收：
                <div
                  :style="{width: disable &&
                    !normal &&
                    !(data[index][map['childList']] &&
                      data[index][map['childList']].length) ? '100px' : 'auto'}"
                >
                  <el-input
                    v-if="disable &&
                      !normal &&
                      !(data[index][map['childList']] &&
                        data[index][map['childList']].length)"
                    v-model.trim="data[index][map['netReceiptsNotes']]"
                    size="mini"
                    @input="numberInput($event, [{index, key:'netReceiptsNotes'}])"
                    @blur="change(index, false)"
                  />
                  <p v-else>
                    ￥{{ data[index][map['netReceiptsNotes']] | toFixed }}
                  </p>
                </div>
              </div>
              <div class="input">应收：
                <div
                  :style="{width: disable && status !== 'transfer' && !normal && !(data[index][map['childList']] && data[index][map['childList']].length) ? '100px' : 'auto'}"
                >
                  <el-input
                    v-if="disable && status !== 'transfer' && !normal && !(data[index][map['childList']] && data[index][map['childList']].length)"
                    v-model.trim="data[index][map['receivableNotes']]"
                    size="mini"
                    @input="numberInput($event, [{index, key:'receivableNotes'}])"
                    @blur="change(index, false)"
                  />
                  <p v-else :style="{width: status === 'transfer' ? '100px' : 'auto'}">
                    ￥{{ data[index][map['receivableNotes']] | toFixed }}
                  </p>
                </div>
              </div>
            </template>
          </div>

          <div class="col delete">
            <etm-text v-if="isDelete" type="danger" @click="deleteData(index)">删除</etm-text>
          </div>
        </div>

        <div v-for="(i, k) in item[map['childList']]" :key="k" class="row child-row">
          <div v-for="(ii, kk) in columns" :key="kk" class="col" :style="{width : ii.width || '30%'}">

            <template v-if="kk===0">
              <!--              <div v-if="showImg" class="itemImg">-->
              <!--                <img src="../../../../assets/images/etm-logo.png">-->
              <!--              </div>-->

              <el-image
                v-if="showImg && i[map['img']] && data[index][map['img']] !== '--'"
                fit="cover"
                class="itemImg"
                :src="i[map['img']]"
                alt=""
              />
              <div v-else class="itemImg">
                <img src="../../../../assets/images/etm-logo-contract.png">
              </div>
              <div :style="{flex:1, textAlign : 'left'}">{{
                i[map['name']]
              }}
              </div>
            </template>

            <template v-if="kk===1">
              <div class="input">实收：
                <div
                  :style="{width: disable && !item[map['modify']] && !normal && !(data[index][map['childList']] && data[index][map['childList']].length) ? '100px' : 'auto'}"
                >
                  <el-input
                    v-if="disable && !item[map['modify']] && !normal && !(data[index][map['childList']] && data[index][map['childList']].length)"
                    v-model="data[index][map['childList']][k][map['netReceipts']]"
                    size="mini"
                    @blur="change(index, k)"
                    @input="numberInput($event, [{index, key:'childList'}, {index:k, key:'netReceipts'}])"
                  />
                  <p v-else>
                    ￥{{ data[index][map['childList']][k][map['netReceipts']] | toFixed }}
                  </p>
                </div>
              </div>
              <div class="input">应收：
                <div :style="{width: disable && !item[map['modify']] && normal ? '100px' : 'auto'}">
                  <el-input
                    v-if="disable && !item[map['modify']] && normal"
                    v-model="data[index][map['childList']][k][map['receivable']]"
                    size="mini"
                    @input="numberInput($event, [{index, key:'childList'}, {index:k, key:'receivable'}])"
                  />
                  <p v-else>
                    ￥{{ data[index][map['childList']][k][map['receivable']] | toFixed }}
                  </p>
                </div>
              </div>
            </template>

            <template v-if="kk===2">
              <div class="input">{{ text }}购买：
                <div>
                  <el-input-number
                    v-if="disable && !item[map['modify']]"
                    v-model="data[index][map['childList']][k][map['purchase']]"
                    :min="0"
                    size="mini"
                    @blur="numberChange(index, k)"
                    @change="numberChange(index, k)"
                  />
                  <p v-else>
                    {{ data[index][map['childList']][k][map['purchase']] }}
                  </p>
                </div>
              </div>
              <div class="input">{{ text }}赠送：
                <el-input-number
                  v-if="disable && !item[map['modify']]"
                  v-model="data[index][map['childList']][k][map['give']]"
                  :min="0"
                  size="mini"
                  @blur="event => { if(!data[index][map['childList']][k][map['give']]) data[index][map['childList']][k][map['give']] = 0 }"
                />
                <p v-else>
                  {{ data[index][map['childList']][k][map['give']] }}
                </p>
              </div>
            </template>

            <template v-if="kk===3">
              <div class="input">实收：
                <div :style="{width: disable && !normal && !item[map['modify']] ? '100px' : 'auto'}">
                  <el-input
                    v-if="disable && !normal && !item[map['modify']]"
                    v-model.trim="data[index][map['childList']][k][map['netReceiptsNotes']]"
                    size="mini"
                    @input="numberInput($event, [{index, key:'childList'}, {index:k, key:'netReceiptsNotes'}])"
                    @blur="change(index, k)"
                  />
                  <p v-else>
                    ￥{{ data[index][map['childList']][k][map['netReceiptsNotes']] | toFixed }}
                  </p>
                </div>
              </div>
              <div class="input">应收：
                <div
                  :style="{width: disable && status !== 'transfer' && !normal && !normal && !item[map['modify']] ? '100px' : 'auto'}"
                >
                  <el-input
                    v-if="disable && !normal && !item[map['modify']]"
                    v-model.trim="data[index][map['childList']][k][map['receivableNotes']]"
                    size="mini"
                    @input="numberInput($event, [{index, key:'childList'}, {index:k, key:'receivableNotes'}])"
                    @blur="change(index, k)"
                  />
                  <p v-else :style="{width: status === 'transfer' ? '100px' : 'auto'}">
                    ￥{{ data[index][map['childList']][k][map['receivableNotes']] | toFixed }}
                  </p>
                </div>
              </div>

            </template>
          </div>
          <div class="col delete" />
        </div>
      </div>

    </div>
    <div v-else>
      <etm-empty />
    </div>
  </div>
</template>

<script>
/**
 * nestingTable create by Administrator
 * createTime 2020/9/3 13:43
 */
import { deepClone, toFixed } from '../common'

export default {
  name: 'NestingTable',
  components: {},
  filters: {
    toFixed(number) {
      return (number * 100 / 100).toFixed(2)
    }
  },
  mixins: [],
  model: {
    prop: 'data',
    event: 'evt'
  },
  props: {
    disable: {
      type: Boolean,
      default: true
    },
    text: {
      type: String,
      default: ''
    },
    showImg: {
      type: Boolean,
      default: true
    },
    status: { // 转课状态特殊处理
      type: String,
      default: ''
    },
    // 是否正常人思维
    normal: {
      type: Boolean,
      default: false
    },
    isDelete: {
      type: Boolean,
      default: true
    },
    columns: {
      type: Array,
      default() {
        return [
          {
            label: '项目名称',
            width: '26%'
          }, {
            label: '单价',
            width: '18%'
          }, {
            label: '数量',
            width: '28%'
          }, {
            label: '小计',
            width: '21%'
          }
        ]
      }
    },
    map: {
      type: Object,
      default() {
        return {
          id: 'id',
          name: 'name',
          netReceipts: 'netReceipts', // 实收
          give: 'give', // 赠送
          receivable: 'receivable', // 应收
          purchase: 'purchase', // 购买
          img: 'img',
          modify: 'modify',
          netReceiptsNotes: 'netReceiptsNotes', // 实收总额
          receivableNotes: 'receivableNotes', // 应收总额
          cacSetMealEnum: 'cacSetMealEnum', // 类型
          childList: 'childList'
        }
      }
    },
    data: {
      type: Array,
      default() {
        return []
      }
    },
    delete: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      cacheData: [] // 最开始的数据
    }
  },
  computed: {},
  watch: {
    data: {
      deep: true,
      immediate: true,
      handler(n, o) {
        if (!this.cacheData.length) {
          this.cacheData = deepClone(n)
        }
      }
    }
  },

  created() {

  },
  mounted() {
  },
  methods: {
    numberInput(e, map) {
      let value = e.replace(/[^\d^\.]/g, '')
      const parent = this.data[map[0].index]
      let children

      if (e === '') {
        return false
      }

      if (value.length > 8) {
        value = value.substr(0, 8)
      }

      if (map.length === 1) {
        parent[this.map[map[0].key]] = value
      } else {
        children = parent[this.map[map[0].key]]
        children[map[1].index][this.map[map[1].key]] = value
      }
    },
    change(parentId, childId) {
      const parent = this.data[parentId]
      const map = this.map

      if (childId === false) {
        if (parent[map['purchase']]) {
          parent[map['receivable']] = (parent[map['receivableNotes']] / parent[map['purchase']]).toFixed(2)
        } else {
          parent[map['receivable']] = 0
          parent[map['receivableNotes']] = 0
        }

        if (parent[map['purchase']]) {
          parent[map['netReceipts']] = (parent[map['netReceiptsNotes']] / parent[map['purchase']]).toFixed(2)
        } else {
          parent[map['netReceipts']] = 0
          parent[map['netReceiptsNotes']] = 0
        }
      } else {
        const child = parent[map['childList']][childId]

        if (child[map['purchase']]) {
          child[map['receivable']] = (child[map['receivableNotes']] / child[map['purchase']]).toFixed(2)
        } else {
          child[map['receivable']] = 0
          child[map['receivableNotes']] = 0
        }

        if (child[map['purchase']]) {
          child[map['netReceipts']] = (child[map['netReceiptsNotes']] / child[map['purchase']]).toFixed(2)
        } else {
          child[map['netReceipts']] = 0
          child[map['netReceiptsNotes']] = 0
        }

        let receivable = 0
        let netReceipts = 0

        parent[map['childList']].forEach(cur => {
          receivable += toFixed(cur[map['receivableNotes']])
          netReceipts += toFixed(cur[map['netReceiptsNotes']])
        })

        parent[map['receivableNotes']] = receivable.toFixed(2)
        parent[map['netReceiptsNotes']] = netReceipts.toFixed(2)
      }
    },
    numberChange(parentId, childId) {
      this.$nextTick(() => {
        if (childId === false) {
          if (!this.data[parentId][this.map['purchase']]) {
            this.data[parentId][this.map['purchase']] = 0
          }

          this.data[parentId][this.map['receivableNotes']] = (this.data[parentId][this.map['receivable']] * this.data[parentId][this.map['purchase']]).toFixed(2)
          this.data[parentId][this.map['netReceiptsNotes']] = (this.data[parentId][this.map['netReceipts']] * this.data[parentId][this.map['purchase']]).toFixed(2)
        } else {
          if (!this.data[parentId][this.map['childList']][childId][this.map['purchase']]) {
            this.data[parentId][this.map['childList']][childId][this.map['purchase']] = 0
          }
          this.data[parentId][this.map['childList']][childId][this.map['receivableNotes']] = (this.data[parentId][this.map['childList']][childId][this.map['receivable']] * this.data[parentId][this.map['childList']][childId][this.map['purchase']]).toFixed(2)
          this.data[parentId][this.map['childList']][childId][this.map['netReceiptsNotes']] = (this.data[parentId][this.map['childList']][childId][this.map['netReceipts']] * this.data[parentId][this.map['childList']][childId][this.map['purchase']]).toFixed(2)

          let receivable = 0
          let netReceipts = 0

          this.data[parentId][this.map['childList']].forEach(cur => {
            receivable += toFixed(cur[this.map['receivableNotes']])
            netReceipts += toFixed(cur[this.map['netReceiptsNotes']])
          })

          this.data[parentId][this.map['receivableNotes']] = receivable.toFixed(2)
          this.data[parentId][this.map['netReceiptsNotes']] = netReceipts.toFixed(2)
        }
      })
    },
    getCache() {
      return this.cacheData
    },
    delCache() {
      this.cacheTemplate = []
    },
    updateCache() {
      this.cacheData = {}
    },
    deleteData(index) {
      this.$emit('del', this.data[index])
      this.data.splice(index, 1)
    }
  }
}
</script>
<style lang="scss" scoped>
.nestingTable-wrap {

  margin: 0 0 16px 0;

  .row-body {
    .box {
      margin-top: 16px;
      border-bottom: 1px solid #EEEEEE;
      border-top: 1px solid #EEEEEE;

      &:first-child {
        margin-top: 0;
      }
    }
  }

  .child-row {
    border-top: 1px dashed #EEEEEE;
  }

  .row {
    font-size: 14px;
    display: flex;
    padding: 16px 0;
    //margin-top: 24px;
    //border-bottom: 2px dashed #EEEEEE;

    //&:nth-child(2) {
    //  margin-top: 0;
    //  border-top: none;
    //}

    .col {
      padding: 0 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      img {
        width: 100px;
        height: 54px;
      }

      //.image{
      //  width: 100px;
      //  height: 54px;
      //}

      .itemImg {
        margin-right: 15px;
        width: 45%;
        height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 2px;
        @include bgc_divide_color();

        img {
          width: 48px;
          height: auto;
        }
      }

      .especially {
        margin-bottom: 8px;
        color: #CCCCCC;

        div {
          width: 130px;
        }

        &:last-child {
          margin-bottom: 0;
          margin-top: 8px;
        }
      }

      .image {
        width: 45%;
        height: 60px;
        overflow: hidden;
        border-radius: 2px;
      }

      .input:first-child {
        margin-bottom: 8px;
      }

      &:first-child {
        display: flex;
        flex-direction: row;
      }

      &.delete {
        width: 7%;
      }
    }

    &.row-title {
      padding: 0;
      border-bottom: none;

      .col {
        height: 42px;
        color: #9A9A9A;
        flex-direction: row;
        justify-content: center;
        display: flex;
        align-items: center;
        background: #FAFAFA;
      }
    }
  }

  .input {

    display: flex;
    align-items: center;
    //margin: 2px 0;
  }
}
</style>

