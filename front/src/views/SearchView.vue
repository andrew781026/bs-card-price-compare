<template>
  <el-row :gutter="20">
    <el-col
        :xs="12" :sm="6" :md="4" :lg="3" :xl="2"
        v-for="(o, index) in 10"
        :key="o"
        class="my-20"
    >
      <SingleCard big-pic="https://img.ruten.com.tw/s2/d/66/34/22212338154036_414.png"
                  buy-link="https://www.ruten.com.tw/item/show?22212338154036"
                  stock="20"
                  :card-id="o + '10'"
                  :price="o + '10'"
                  :card-name="o+ '10'">

      </SingleCard>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import {ref} from 'vue'
import SingleCard from '../components/SingleCard.vue'

export default {
  name: "SearchView",
  components: {
    SingleCard
  },
  setup() {
    const currentDate = ref(new Date())

    return {currentDate}
  }
}
</script>

<style scoped>

.card-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.my-20{
  margin: 20px 0;
}

</style>