<template>
  <ul class="timeAxis">
    <li v-for="(record, index) in data" :key="index" class="textLeft">
      <svg class="logo" xmlns="http://www.w3.org/2000/svg" width="54" height="28" viewBox="0 0 107 55">
        <path
          id="angle"
          class="cls-1"
          d="M1032,842v42a6,6,0,0,1-6,6H941a6,6,0,0,1-6-6V841a6,6,0,0,1,6-6h95a6,6,0,0,1,6,6v1h-10Z"
          transform="translate(-935 -835)"
        />
      </svg>
      <span class="date">
        {{ record.date }}
      </span>
      <div
        v-for="(item, ind) in record.records"
        :key="ind"
        class="record"
        :class="ind !== 0 ? 'van-hairline--top' : ''"
        @click="toDetail(item.id, item.customerId)"
      >
        <div class="title">{{ item.title }}</div>
        <div class="text">
          {{ item.text }}
        </div>
        <ul v-if="item.pictures" class="pictures">
          <li v-for="(img, i) in item.pictures" :key="'img' + i">
            <img :src="img" :alt="'img' + i">
          </li>
        </ul>
        <div class="clearfix">
          <span class="reporter left">{{ item.reporter }}</span>
          <span class="recordTime right">录入时间：{{ item.recordTime }}</span>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {}
  },
  computed: {},
  methods: {
    toDetail(id, customerId) {
      this.$router.push({
        path: 'followRecordDetail',
        query: {
          followId: id,
          customerId: customerId
        }
      })
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

    .timeAxis {
        background-color: $bg-5;
        padding: 23.5px 12px 0;

        li {
            position: relative;
            padding: 14px 13.5px 0 52.5px;
            margin-bottom: 13.5px;
            border-radius: 3px;
            background-color: $white;

            .logo {
                position: absolute;
                top: -2px;
                left: 0;
            }

            .cls-1 {
                fill: $theme;
                fill-rule: evenodd;
            }

            .date {
                display: block;
                position: absolute;
                top: 2.5px;
                left: 6px;
                font-size: 14px;
                color: $white;
            }

            div:first-of-type {
                border: none;
            }

            .record {
                padding: 25px 0 20px;

                .title {
                    margin-bottom: 14px;
                    font-size: 16px;
                    line-height: 1;
                    color: $text-2;
                    font-weight: bold;
                }

                .text {
                    margin-bottom: 12.5px;
                    font-size: 15px;
                    line-height: 20px;
                    color: $text-2;
                }

                .pictures {
                    display: flex;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    margin: -6px 0 12px;

                    li {
                        padding: 0;
                        margin: 6px 0 12px;

                        img {
                            display: block;
                            width: 90px;
                            height: 90px;
                            border-radius: 2px;
                            object-fit: cover;
                        }
                    }
                }

                .reporter {
                    font-size: 12px;
                    color: $text-6;
                }

                .recordTime {
                    font-size: 12px;
                    color: $text-9;
                }
            }
        }
    }
</style>
