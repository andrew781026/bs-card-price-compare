<template>
  <div>
    <template v-for="info in data" :key="info.searchId">
      <h2>{{ info.site }}</h2>
      <el-row :gutter="20">
        <el-col
            :xs="12" :sm="6" :md="4" :lg="3" :xl="2"
            v-for="(s, index) in info.cards"
            :key="s.id"
            class="my-20"
        >
          <SingleCard v-bind="s"></SingleCard>
        </el-col>
      </el-row>
    </template>
  </div>
</template>

<script lang="ts">
import {ref} from 'vue'
import SingleCard from '../components/SingleCard.vue'

function _uuid() {
  var d = Date.now();
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    d += performance.now(); //use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

const data = [
  {
    searchId: _uuid(),
    site: 'カードショップ 遊々亭',
    cards: new Array(10).fill('').map(() => ({
      bigPic: 'https://img.yuyu-tei.jp/card_image/bs/front/sd63/10003.jpg',
      buyLink: 'https://yuyu-tei.jp/game_bs/carddetail/cardpreview.php?VER=sd63&CID=10003&MODE=sell',
      stock: 2,
      id: _uuid(),
      cardId: 'SD63-003',
      price: 50,
      cardName: '天照機巧・五誓君アマツ・ヒコ'
    }))
  },
  {
    searchId: _uuid(),
    site: 'バトルスピリッツ販売・買取専門店【フルアヘッド】',
    cards: new Array(10).fill('').map(() => ({
      bigPic: 'https://img.ruten.com.tw/s2/d/66/34/22212338154036_414.png',
      buyLink: 'https://www.ruten.com.tw/item/show?22212338154036',
      stock: 20,
      id: _uuid(),
      cardId: 'SD63-003',
      price: 100,
      cardName: '卡片名稱'
    }))
  },
  {
    searchId: _uuid(),
    site: '露天拍賣',
    cards: new Array(10).fill('').map(() => ({
      bigPic: 'https://img.ruten.com.tw/s2/d/66/34/22212338154036_414.png',
      buyLink: 'https://www.ruten.com.tw/item/show?22212338154036',
      stock: 20,
      id: _uuid(),
      cardId: 'SD63-003',
      price: 100,
      cardName: '卡片名稱'
    }))
  },
  {
    searchId: _uuid(),
    site: 'Buyee',
    cards: new Array(10).fill('').map(() => ({
      bigPic: 'https://img.ruten.com.tw/s2/d/66/34/22212338154036_414.png',
      buyLink: 'https://www.ruten.com.tw/item/show?22212338154036',
      stock: 20,
      id: _uuid(),
      cardId: 'SD63-003',
      price: 100,
      cardName: '卡片名稱'
    }))
  }
]

export default {
  name: "SearchView",
  components: {
    SingleCard
  },
  setup() {
    const currentDate = ref(new Date())

    return {currentDate, data}
  }
}
</script>

<style scoped>

.card-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.my-20 {
  margin: 20px 0;
}

</style>