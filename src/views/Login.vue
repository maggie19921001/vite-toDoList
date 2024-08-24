<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { onMounted, ref } from "vue";
import axios from "axios";

const ApiBase = "https://todolist-api.hexschool.io";

//登入
const LoginData = ref({
  email: "",
  password: "",
});
const Token = ref('')
const FillError = ref('')

const Login = async()=>{
  try{
    const res = await axios.post(`${ApiBase}/users/sign_in`,LoginData.value);
    alert("登入成功")
    Token.value = res.data.token;

  }catch(error){
    FillError.value =error.message;
  }
}

//驗證 
const user = ref({
  nickname:'',
  uid:''
})
const checkError = ref('');

const checkOut = async()=>{
  const LimitDate = new Date(); //設定當前日期 如8/10
  LimitDate.setDate(LimitDate.getDate() + 1); //設定日期為>取得日10+1=8/11
  document.cookie = `loginToken=${Token.value}; expires=${LimitDate.toUTCString()}`; 
  //cookie值設定為輸入之token，取得日期後轉為時間字串格式設定為過期日
  try{
    const res = await axios.get(`${ApiBase}/users/checkout`,{
    headers:{Authorization:Token.value,}
    });
    user.value=res.data
  }catch(error){
    checkError.value =error.message;
  }
}
</script>

<template>
<div id="loginPage" class="bg-yellow">
  <div class="container loginPage vhContainer ">
    <div class="side">
      <a href="#"><img class="logoImg" src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/logo.png" alt=""></a>
      <img class="d-m-n" src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/img.png" alt="workImg">
    </div>
    <form class="formControls" action="index.html">
      <h2 class="formControls_txt">最實用的線上代辦事項服務</h2>
      <label class="formControls_label" for="email">Email</label>
      <input class="formControls_input" type="text" id="email" name="email" placeholder="請輸入 email" required v-model="LoginData.email">
      <span>此欄位不可留空</span>
      <label class="formControls_label" for="pwd">密碼</label>
      <input class="formControls_input" type="password" name="pwd" id="pwd" placeholder="請輸入密碼" required v-model="LoginData.password">
      <input class="formControls_btnSubmit" type="button" onclick="Login:location.href='#todo'" value="登入">
      <RouterLink to="/signup" class="formControls_btnLink">註冊帳號</RouterLink>
      <RouterLink to="/todo" class="formControls_btnLink">ToDo</RouterLink>
    </form>
  </div>
</div>

</template>
<style  scoped>
.loginPage {
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
  .loginPage {
    width: 100%;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
        -ms-flex-direction: column;
            flex-direction: column;
    margin: 0 auto;
    padding: 48px 31px;
    -webkit-box-pack: start;
        -ms-flex-pack: start;
            justify-content: start;
  }
}

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
</style>