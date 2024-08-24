<script setup>
import { ref } from "vue";
import axios from "axios";
const ApiBase = "https://todolist-api.hexschool.io";
import { useRouter } from 'vue-router';




//功能設定：按編輯按鈕後。編輯按鈕消失，編輯框顯示（內有原始值）並出現確定按鈕
//按下確定後原始值更新，剩下編輯按鈕

// 從cookie中提取token (cookie原始值是物件)
const getTokenFromCookie = () => {
  const cookieArr = document.cookie.split(';');
  for (let cookie of cookieArr) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'loginToken') {
      return value;
    }
  }
  return null;
};
const tokenCookie = getTokenFromCookie();

//登出 
const router = useRouter(); // 引入 useRouter Hook
//[?]因登出不需提供資料，所以第二個{}為空 (但不確定為何不能省略)
const logOut = async()=>{
    try{
        const res = await axios.post(`${ApiBase}/users/sign_out`,{},{
        headers:{Authorization:tokenCookie,}
        });
        router.push("/login");
    }catch(error){
        console.log(error.message);
    }
}
//資料設定
const todos =ref([]);//API回傳陣列
const todoText =ref('');//輸入值
const todo = {content:'',}//API傳輸值
const editText =ref({});//編輯值

// 取得所有待辦
const getTodos = async()=>{
    const res = await axios.get(`${ApiBase}/todos`,{
    headers:{Authorization:tokenCookie,}
    });
    console.log(res.data);
    todos.value=res.data.data;
}
getTodos();
// 新增 先取得content再發送post，最後還原空格
const todoAdd = async()=>{
    if(todoText != undefined){
        todo.content = todoText.value
    }
    await axios.post(`${ApiBase}/todos`,todo,{
        headers:{Authorization:tokenCookie,}
    })
    todoText.value='';
    getTodos();
}
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
    <div id="todoListPage" class="bg-half">
      <p>Token: {{ tokenCookie }}</p>
        <nav>
            <h1>ONLINE TODO LIST</h1>
            <ul>
            <li class="todo_sm"><a href="#"><span>王小明的代辦</span></a></li>
            <li><a href="#" @click="logOut">登出</a></li>
            </ul>
        </nav>
        <div class="container todoListPage vhContainer">
            <div class="todoList_Content">
            <div class="inputBox">
                <input type="text" placeholder="請輸入待辦事項" v-model="todoText">
                <button  @click="todoAdd" class="fa fa-plus">＋</button>
            </div>
            <div class="todoList_list">
                <ul class="todoList_tab">
                <li><a href="#" class="active">全部</a></li>
                <li><a href="#">待完成</a></li>
                <li><a href="#">已完成</a></li>
                </ul>
                <div class="todoList_items">
                <ul class="todoList_item">
                    <li v-for="(todo , index) in todos" :key="index">
                    <label class="todoList_label">
                        <input class="todoList_input" type="checkbox" v-model="todo.status" @click="toggleStatus(todo.id)">
                        {{ todo.content }}   {{ todo.status?'完成':'未完成' }}
                      <div v-if="todo.isEditing">
                        <input type="text" v-model="editText[todo.id]" @change="changeText($event, todo.id)">
                        <button type="button" @click="comfirmEdit(todo.id)">確定</button>
                      </div>
                        <button type="button" @click="todoEdit(todo.id)">編輯</button>
                        <button type="button" @click="todoDelete(todo.id)">刪除</button>
                    </label>
                    <a href="#">
                        <i class="fa fa-times"></i>
                    </a>
                    </li>
                </ul>
                <div class="todoList_statistics">
                    <p> 5 個已完成項目</p>
                </div>
                </div>
            </div>
            </div>
        </div>
    </div>

</template>
<style scoped>
.todoListPage {
  padding: 16px 32px;
}

@media (max-width: 576px) {
  .todoListPage {
    background-image: linear-gradient(175deg, #FFD370 100%, #fff 0%);
  }
}

.todoList_Content {
  width: 500px;
  margin: 0 auto;
}

@media (max-width: 576px) {
  .todoList_Content {
    width: 100%;
  }
}

.inputBox {
  width: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  position: relative;
  margin-bottom: 16px;
  -webkit-box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.15);
          box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.15);
}

.inputBox input {
  background: #fff;
  border: none;
  border-radius: 10px;
  position: relative;
  width: 100%;
  height: 47px;
  font-size: 1rem;
  padding-left: 16px;
}

.inputBox button {
  display: block;
  width: 40px;
  height: 39px;
  position: absolute;
  background: #333333;
  color: white;
  font-size: 20px;
  text-decoration: none;
  text-align: center;
  border-radius: 10px;
  top: 4px;
  right: 4px;
  /* padding: 10px; */
}

.todoList_list {
  background: #fff;
  border-radius: 10px;
  -webkit-box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.15);
          box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.15);
}

.todoList_list .todoList_tab {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: space-evenly;
      -ms-flex-pack: space-evenly;
          justify-content: space-evenly;
}

.todoList_list .todoList_tab li {
  width: 100%;
}

.todoList_list .todoList_tab a {
  display: block;
  color: #9F9A91;
  text-decoration: none;
  line-height: 20px;
  font-weight: bold;
  text-align: center;
  padding: 16px;
  border-bottom: 2px solid #efefef;
}

.todoList_list .todoList_tab .active {
  color: #333333;
  border-bottom: 2px solid #333333;
}

.todoList_list .todoList_items {
  padding-top: 23px;
  padding-left: 24px;
  padding-right: 17px;
  padding-bottom: 32px;
}

.todoList_list .todoList_items .todoList_item {
  margin-bottom: 8px;
}

.todoList_list .todoList_items .todoList_label {
  width: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
      -ms-flex-align: center;
          align-items: center;
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 15px;
  color: #333333;
  line-height: 20.27px;
}

.todoList_list .todoList_items .todoList_input {
  width: 20px;
  height: 20px;
  border: 1px solid #9F9A91;
  border-radius: 5px;
  margin-right: 16px;
}

.todoList_list .todoList_items .todoList_input:checked ~ span {
  color: #9F9A91;
  text-decoration: line-through;
  -webkit-transition: all 0.4s ease-in-out;
  transition: all 0.4s ease-in-out;
}

.todoList_list .todoList_items li {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
      -ms-flex-align: center;
          align-items: center;
  margin-bottom: 17px;
}

.todoList_list .todoList_items li a {
  margin-left: 17px;
  display: block;
  font-size: 14px;
  color: #333333;
  opacity: 0;
}

.todoList_list .todoList_items li:hover a {
  opacity: 1;
}

.todoList_list .todoList_statistics {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
      -ms-flex-pack: justify;
          justify-content: space-between;
}

.todoList_list .todoList_statistics p {
  color: #333333;
  font-size: 0.875rem;
}

.todoList_list .todoList_statistics a {
  color: #9F9A91;
  font-size: 0.875rem;
  text-decoration: none;
}
</style>