import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const todos =ref([]);//API回傳陣列

  return { todos }
})


