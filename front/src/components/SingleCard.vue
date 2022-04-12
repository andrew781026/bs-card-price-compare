<template>
  <el-card :body-style="{ padding: '0px' }">
    <img
        :src="bigPic"
        class="image"
    />
    <div class="p-3" style="z-index: 10;background-color: #fff">
      <div class="text-2xl font-900">{{ cardId }}</div>
      <p>{{ cardName }}</p>
      <p class="flex justify-between">
        <span>${{ price }}</span>
        <span>殘：{{ stock }}</span>
      </p>
      <el-button type="primary" class="w-full" @click="window.open(buyLink, '_blank').focus();">購買</el-button>
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
      type: [String, Number],
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
      type: [String, Number],
      required: true
    }
  },
})
</script>

<style scoped>
.cardHeader {
  font-size: 1.5rem; /* 24px */
  font-weight: 900;
  padding: 0.5rem 0.75rem;
  background-color: #adaaaa;
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
  cursor: pointer;
  transition: all 0.2s;
}
/*
.image:hover{
  transform: scale(1.2);
}
 */
</style>