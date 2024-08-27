<script setup> 
import { ref,onMounted } from "vue";
import axios from "axios";
const ApiBase = "https://todolist-api.hexschool.io";
import { useRouter } from 'vue-router';

// 從cookie中提取token (cookie原始值是物件)
const getTokenFromCookie = () => {
  const cookieArr = document.cookie.split(';');
  for (let cookie of cookieArr) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'loginToken') {
      return value;
    }else{
      alert('沒有token，請重新登入');
      setTimeout(()=>{
        router.push('/')
    },1000)
    }
  }
  return null;
};

const tokenCookie = getTokenFromCookie();

//資料設定
const todos =ref([]);//API回傳陣列
const todo = {content:'',}//API傳輸值
const editText =ref({});//編輯值

// 取得所有待辦
const getTodos = async()=>{
    const res = await axios.get(`${ApiBase}/todos`,{
    headers:{Authorization:tokenCookie,}
    });
    todos.value=res.data.data;
}
getTodos();

//編輯
const changeText = (event,id) => {
    editText.value = {
    ...editText.value,
    [id]: event.target.value,
  };
};
const todoEdit = (id)=> {
    // 找到對應的 todo 項目，切換 isEditing 狀態
    const todo = todos.value.find((todo) => todo.id === id);
    if (todo) {
        todo.isEditing = !todo.isEditing;//將原先false轉為true
        editText.value[id] = todo.content;
    }
}
const comfirmEdit = async(id)=>{
    const todo = todos.value.find((todo) => todo.id === id);
    todo.content = editText.value[id];
    await axios.put(`${ApiBase}/todos/${id}`,todo, {
        headers: {Authorization: tokenCookie,},
    });

    todo.isEditing = false; // 隱藏編輯框
    getTodos();
     editText.value = {
    ...editText.value,
    [id]: '',
}
}
//刪除
const todoDelete = async(id)=>{
    if (confirm("確定要刪除嗎？") == true) {
        await axios.delete(`${ApiBase}/todos/${id}`, {
        headers: {Authorization:tokenCookie,},
      });
     getTodos();
    }else {
};

}
//完成狀態
const toggleStatus = async (id) => {
  await axios.patch(
    `${ApiBase}/todos/${id}/toggle`,
    {},
    {headers: { Authorization: tokenCookie,},}
  );
  getTodos();
};
</script>

<template>
  <div v-if="todos.length === 0" class="no-item">目前尚無待辦事項</div>
    <ul v-else class="todoList_item">
        <li v-for="(todo , index) in todos" :key="index">
            <template v-if="todo.status===false">
                <label class="todoList_label">
                  <div class="items">
                    <input class="todoList_input" type="checkbox" v-model="todo.status" @click="toggleStatus(todo.id)">
                    {{ todo.content }} 
                  </div>
                  <div class="btns">
                    <div v-if="todo.isEditing">
                    <input type="text" v-model="editText[todo.id]" @change="changeText($event, todo.id)">
                    <button type="button" @click="comfirmEdit(todo.id)">確定</button>
                    </div>
                    <button type="button" @click="todoEdit(todo.id)">編輯</button>
                    <button type="button" @click="todoDelete(todo.id)">刪除</button>
                  </div>
                </label>
            </template>
        </li>
    </ul>
</template>
<style>
</style>