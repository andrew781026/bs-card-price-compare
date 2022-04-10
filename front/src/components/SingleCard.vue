<template>
  <el-card :body-style="{ padding: '0px' }">
    <img
        :src="bigPic"
        class="image"
    />
    <div style="padding: 14px">
      <span>Yummy hamburger</span>
      <div class="bottom">
        <time class="time">{{ cardName }}</time>
        <el-button type="text" class="button" @click="window.open(buyLink, '_blank').focus();">購買</el-button>
      </div>
    </div>
  </el-card>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "SingleCard",
  // https://v3.cn.vuejs.org/guide/composition-api-setup.html
  setup(props) {
    return props
  },
  props: {
    bigPic: { // 大圖
      type: String,
      required: true
    },
    smallPic: { // 小圖
      type: String,
      required: false
    },
    buyLink: { // 購買連結
      type: String,
      required: true
    },
    stock: { // 可購買數量
      type: String,
      required: true
    },
    cardId: {   // 卡片編號
      type: String,
      required: true
    },
    cardName: {   // 卡片名稱
      type: String,
      required: true
    },
    price: {   // 卡片價格
      type: String,
      required: true
    }
  },
})
</script>

<style scoped>
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button {
  padding: 0;
  min-height: auto;
}

.image {
  width: 100%;
  display: block;
}
</style>