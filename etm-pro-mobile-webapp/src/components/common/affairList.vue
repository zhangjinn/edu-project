<template>
  <ul class="affairList">
    <li v-for="(item, index) in data" :key="index" class="textLeft">
      <div class="clearfix" @click="deal(item)">
        <div class="type left">
          <i v-if="!isDone(item.type)" :class="['circle', affairType(item.type)]" />
          <svg
            v-else
            class="done"
            xmlns="http://www.w3.org/2000/svg"
            width="8"
            height="6"
            viewBox="0 0 16 12"
          >
            <path
              id="done"
              class="cls-1"
              d="M1933.66,1503.93l-9.61,9.72a1.117,1.117,0,0,1-1.6,0l-4.15-4.19a1.159,1.159,0,0,1,0-1.62,1.147,1.147,0,0,1,1.61,0l3.34,3.38,8.81-8.91a1.117,1.117,0,0,1,1.6,0A1.159,1.159,0,0,1,1933.66,1503.93Z"
              transform="translate(-1918 -1502)"
            />
          </svg>
        </div>
        <div class="content left">
          <div :class="{affair: true, done: isDone(item.type)}">{{ item.affair }}</div>
          <div class="detail">
            <span v-if="item.date" class="date">{{ item.date }}</span>
            <span class="time">{{ item.time }}</span>
            <span v-if="item.tag === 'o'" class="tag textCenter o">逾期</span>
            <span v-if="item.tag === 'i'" class="tag textCenter i">已忽略</span>
          </div>
        </div>
        <div v-if="item.handle" class="handle right" @click.stop="operate(item, index)">
          <i :class="['iconfont', item.handle === 'd' ? 'icondelete' : 'iconignore']" />
          <span>{{ item.handle === 'd' ? '删除' : '忽略' }}</span>
        </div>
      </div>
    </li>
  </ul>
</template>
<script>
export default {
  name: 'AffairList',
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    isDone(type) {
      return +type === 0
    },
    affairType(type) {
      switch (+type) {
        case 1:
          return 'g'
        case 2:
          return 'b'
        case 3:
          return 'o'
        case 4:
          return 'r'
        default:
          return ''
      }
    },
    operate(item, index) {
      const data = {
        type: '',
        id: item.id,
        index: index
      }
      if (item.handle === 'i') {
        data.type = 'ignore'
        this.$emit('operation', data)
      } else {
        data.type = 'delete'
        this.$emit('operation', data)
      }
    },
    deal(data) {
      if (data.state === 2) {
        this.$router.push({
          path: 'followEdit',
          query: {
            customerId: data.customerId
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
    .clearfix:after {
        display: block;
        content: '';
        clear: both;
    }

    .affairList {
        background-color: $white;

        li {
            padding: 0 12px;

            & > div {
                padding-top: 13px;
                height: 57px;
                border-bottom: .5px solid $text-e;

                .type {
                    margin-right: 12.5px;

                    .circle {
                        display: block;
                        width: 6px;
                        height: 6px;
                        margin-top: 4px;
                        border-radius: 50%;
                    }

                    .g {
                        background-color: $green;
                    }

                    .b {
                        background-color: $blue;
                    }

                    .o {
                        background-color: $yellow;
                    }

                    .r {
                        background-color: $red;
                    }

                    .done {
                        position: relative;
                        top: -6px;
                    }

                    .cls-1 {
                        fill: $text-9;
                        fill-rule: evenodd;
                    }
                }

                .content {
                    .affair {
                        width: 255px;
                        margin-bottom: 6px;
                        font-size: 15px;
                        line-height: 1;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;

                        &.done {
                            color: $text-9;
                            text-decoration: line-through;
                        }
                    }

                    .detail {
                        font-size: 13px;
                        color: $text-9;

                        .date {
                            margin-right: 8px;
                        }

                        .time {
                            margin-right: 8px;
                        }

                        .tag {
                            display: inline-block;
                            padding: 0 5px;
                            height: 16px;
                            border-radius: 2px;
                            font-size: 11px;
                            line-height: 16px;

                            &.o {
                                color: $red;
                                background-color: $redLight;
                            }

                            &.i {
                                color: $blue;
                                background-color: $blueLight;
                            }
                        }
                    }
                }

                .handle {
                    .iconfont {
                        color: $text-b;
                    }

                    .icondelete {
                        font-size: 12px;
                        margin-right: 3px;
                    }

                    .iconignore {
                        font-size: 15px;
                    }

                    span {
                        margin-left: 5px;
                        font-size: 12px;
                        color: $text-5;
                    }
                }
            }
        }
    }
</style>
