<template>
  <div class="tagEdit textLeft">
    <div class="tagEditForm">
      <van-field v-model="tagValue" placeholder="请描述标签...">
        <van-button slot="button" class="editBtn" size="small" type="primary" @click="editTag">添加</van-button>
      </van-field>
    </div>
    <div class="tagBox">
      <van-tag
        v-for="(item,index) in tagData"
        :key="index"
        class="tag"
        color="#CFF3F3"
        text-color="#10C2C4"
      >
        {{ item.name }}
        <span class="iconfont iconminus-circle" @click="removeTag(index)" />
      </van-tag>
    </div>
    <div v-show="hidshow" class="bottomFixed">
      <div class="bottomBtn notBottomBar van-hairline--top">
        <div class="btn" @click="cancel">
          <control-btn text="取消" type="cancel" />
        </div>
        <div class="btn" @click="save">
          <control-btn text="保存" type="primary" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import controlBtn from '../../../components/common/controlBtn'
import { parseData } from '../../../js/rules'

export default {
  name: 'TagEdit',
  components: {
    controlBtn
  },
  props: {
    tagList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      tagValue: '',
      tagData: []
    }
  },
  computed: {
    hidshow() {
      return this.$store.state.show.showBottom
    }
  },
  created() {
    this.tagData = parseData(this.tagList)
  },
  methods: {
    cancel() {
      this.$emit('tagEditOn', false)
    },
    save() {
      this.$emit('tagEditOn', false)
      this.$emit('tagEditList', this.tagData)
    },
    removeTag(index) {
      this.tagData.splice(index, 1)
    },
    editTag() {
      if (this.tagValue) {
        const data = {
          name: this.tagValue
        }
        this.tagData.push(data)
        this.tagValue = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>

    .tagEdit {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1111;
        padding: 12px;
        background-color: $white;

        .tagEditForm {
            .van-cell {
                padding: 10px 0;
            }

            .van-cell::after {
                position: absolute;
                box-sizing: border-box;
                content: ' ';
                pointer-events: none;
                right: 0;
                bottom: 0;
                left: 0;
                border-bottom: 1px solid $text-e;
                transform: scaleY(0.5);
            }

            .editBtn {
                color: $white;
                font-weight: bold;
                background-color: $theme;
                border: none;
            }
        }

        .tagBox {
            margin-top: 17.5px;

            .tag {
                position: relative;
                margin-right: 20px;
                margin-bottom: 15px;

                .iconfont {
                    position: absolute;
                    right: -6px;
                    top: -8px;
                    color: $red;
                }
            }
        }
    }
</style>
