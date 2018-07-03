<template>
  <div class="login">
      <el-card class="box-card">
        <div>
          <img src="../assets/logo.png" alt="" class="logo">
          <div class="margin-top">
            账号：<el-input v-model="input" placeholder="请输入账号" maxlength="20" class="el-input" />
          </div>
          <div class="margin-top">
            密码：<el-input v-model="pwd" placeholder="请输入密码" type="password" maxlength="20" class="el-input" />
          </div>
          <div class="margin-top">
            <el-button type="primary" class="btn" @click="goHome">登录</el-button>
          </div>
        </div>
      </el-card>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      msg: '登录界面',
      input: '',
      pwd: ''
    }
  },
  methods: {
    goHome () {
      let vm = this
      vm.$router.push({name: 'home', params: {}})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .logo{
    width: 10rem;
    height: 10rem;
  }
  .el-input{
    width: 20rem;
    /*height: 1.5rem;*/
  }
  .margin-top{
    margin-top: 1.5rem;
  }
  .box-card{
    width: 50rem;
    text-align: center;
    position: fixed;
    left: 25%;
    top: 25%;
  }
  .btn{
    width: 10rem;
  }
</style>
