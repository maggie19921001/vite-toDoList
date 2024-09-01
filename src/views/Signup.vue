<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { ref, watch } from "vue";
import axios from "axios";

const router = useRouter();
const apiBase = "https://todolist-api.hexschool.io";

const email = ref('');
const nickname =ref('');
const password =ref('');
const passwordChecked =ref('');

const emailError = ref('');
const nicknameError =ref('');
const passwordError = ref('');
const passwordCheckedError =ref('');

const signUpData = ref({
  email: email,
  password: password,
  nickname: nickname,
});

watch([email, nickname, password, passwordChecked], ([newEmail, newNickname, newPassword, newPasswordChecked]) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(newEmail)) {
    emailError.value = '需要正確的輸入 email 格式';
  } else {
    emailError.value = '';
  }

  if (!newNickname) {
    nicknameError.value = '此欄位不可留空';
  } else {
    nicknameError.value = '';
  }

  if (newPassword.length < 6) {
    passwordError.value = '密碼至少6個字';
  } else {
    passwordError.value = '';
  }

  if(newPasswordChecked != newPassword){
    passwordCheckedError.value ='兩次輸入之密碼不相同';
  } else{
    passwordCheckedError.value ='';
  }
});
const ID = ref('') //先有空值才能存取接收值，並使用在畫面上
const signUp = async()=>{
  if(emailError.value==''&& nicknameError.value==''&& passwordError.value==''&& passwordCheckedError.value==''){
    try{
    const res = await axios.post(`${apiBase}/users/sign_up`,signUpData.value);
      if(confirm("註冊成功")==true){
        router.push("/")
      }
      ID.value = res.data.uid;
  }catch(error){
    alert(error.response.data.message);
  }
  }else{
    alert('請填寫正確資訊')
  }
}
</script>

<template>
<div id="signUpPage" class="bg-yellow">
  <div class="container signUpPage vhContainer">
    <div class="side">
      <a href="#"><img class="logoImg" src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/logo.png" alt=""></a>
      <img class="d-m-n" src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/img.png" alt="workImg">
    </div>
    <form class="formControls" action="index.html">
      <h2 class="formControls_txt">註冊帳號</h2>
      <label class="formControls_label" for="email">Email</label>
      <input class="formControls_input" type="text" id="email" name="email" placeholder="請輸入 email" required v-model="email">
      <span v-if="emailError">{{ emailError }}</span>

      <label class="formControls_label" for="name" >您的暱稱</label>
      <input class="formControls_input" type="text" name="name" id="name" placeholder="請輸入您的暱稱" v-model="nickname">
      <span v-if="nicknameError">{{ nicknameError }}</span>

      <label class="formControls_label" for="pwd">密碼</label>
      <input class="formControls_input" type="password" name="pwd" id="pwd" placeholder="請輸入密碼" required v-model="password">
      <span v-if="passwordError">{{ passwordError }}</span>

      <label class="formControls_label" for="pwd">再次輸入密碼</label>
      <input class="formControls_input" type="password" name="pwdC" id="pwdC" placeholder="請再次輸入密碼" required v-model="passwordChecked">
      <span v-if="passwordCheckedError">{{ passwordCheckedError }}</span>

      <input class="formControls_btnSubmit" type="button" @click="signUp" value="註冊帳號">
      <RouterLink to="/" class="formControls_btnLink">登入</RouterLink>
    </form>
  </div>
</div>
</template>

<style  scoped>
.signUpPage {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
      -ms-flex-pack: justify;
          justify-content: space-between;
  -webkit-box-align: center;
      -ms-flex-align: center;
          align-items: center;
  width: 800px;
}

@media (max-width: 576px) {
  .signUpPage {
    width: 100%;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
        -ms-flex-direction: column;
            flex-direction: column;
    margin: 48px auto 0 auto;
    padding: 48px 31px;
  }
}

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

.inputBox a {
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
  padding: 10px;
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

span{
  margin: 0px 0px;
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
