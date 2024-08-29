<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { ref, watch } from "vue";
import axios from "axios";

const router = useRouter();
const apiBase = "https://todolist-api.hexschool.io";

const email = ref('');
const password =ref('');
const emailError = ref('');

watch([email], ([newEmail]) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(newEmail)) {
    emailError.value = '需要正確的輸入 email 格式';
  } else {
    emailError.value = '';
  }
});

//登入
const loginData = ref({
  email: email,
  password: password,
});
const token = ref('')

const login = async()=>{
  if(emailError.value=='' && password.value.length>5){
    try{
    const res = await axios.post(`${apiBase}/users/sign_in`,loginData.value);
    if (confirm("登入成功") == true) {
      token.value = res.data.token;
      const LimitDate = new Date(); 
      // 設定當前日期 如8/10
      LimitDate.setDate(LimitDate.getDate() + 1); //設定日期為>取得日10+1=8/11
      document.cookie = `loginToken=${token.value}; expires=${LimitDate.toUTCString()}`; 
      //cookie值設定為輸入之token，取得日期後轉為時間字串格式設定為過期日
      router.push("/todo");
       }
    }catch(error){
      alert(error.response.data.message);
    }
  }else{
    alert('請填寫正確資訊')
  }
};


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
      <input class="formControls_input" type="text" id="email" name="email" placeholder="請輸入 email" required v-model="email">
      <span v-if="emailError">{{ emailError }}</span>

      <label class="formControls_label" for="pwd">密碼</label>
      <input class="formControls_input" type="password" name="pwd" id="pwd" placeholder="請輸入密碼" required v-model="password">
      
      <input class="formControls_btnSubmit" type="button" @click="login" value="登入">
      <RouterLink to="/signup" class="formControls_btnLink">註冊帳號</RouterLink>
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