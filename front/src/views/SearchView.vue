<template>
  <div>
    <template v-for="info in data" :key="info.searchId">
      <h2>{{ info.site }}</h2>
      <el-row :gutter="20" v-if="info.done !== false">
        <el-col
            :xs="12" :sm="6" :md="4" :lg="3" :xl="2"
            v-for="(s, index) in info.cards"
            :key="s.id"
            class="my-20"
        >
          <SingleCard v-bind="s"></SingleCard>
        </el-col>
      </el-row>
      <template v-else>
        <div class="crawWrap">
          <span class="loading">載入中...</span>
          <img src="../assets/snail.gif" alt="爬蟲中...">
        </div>
        <h4>爬蟲抓取資料中~~~</h4>
        <el-skeleton style="width: 240px" :loading="true" animated>
          <template #template>
            <el-skeleton-item variant="image" style="width: 240px; height: 240px"/>
            <div style="padding: 14px">
              <el-skeleton-item variant="h3" style="width: 50%"/>
              <div
                  style="
              display: flex;
              align-items: center;
              margin-top: 16px;
              height: 16px;
            "
              >
                <el-skeleton-item variant="text" style="margin-right: 16px"/>
                <el-skeleton-item variant="text" style="width: 30%"/>
              </div>
            </div>
          </template>
        </el-skeleton>
      </template>
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
    done: true,
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
    done: false,
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
    done: true,
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
    done: true,
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
    // 直接使用查詢條件當作 , 當頁的結果
    const currentDate = ref(new Date())

    return {currentDate, data}
  }
}
</script>

<style scoped>

.crawWrap {
  width: 100%;
  position: relative;
}

.crawWrap > img {
  width: 600px;
}

.crawWrap > .loading {
  position: absolute;
  left: 40px;
  top: 40px;
  font-size: 40px;
}

.card-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.my-20 {
  margin: 20px 0;
}

</style>