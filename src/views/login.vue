<template>
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="login" :loading="logining">登录</el-button>
      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
    </el-form-item>
  </el-form>
</template>

<script>
    import MenuUtils from '@/utils/MenuUtils'
    import post from '@/api/axiosApi'
    import instanceUrl from '@/api/interfaceName'
    import util from '@/api/util'
    //import NProgress from 'nprogress'

    var routers = []
    export default {
        data() {
            return {
                logining: false,
                ruleForm2: {
                    account: '15057582615',
                    checkPass: 'qwer'
                },
                rules2: {
                    account: [
                        { required: true, message: '请输入账号', trigger: 'blur' },
                        //{ validator: validaePass }
                    ],
                    checkPass: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        //{ validator: validaePass2 }
                    ]
                },
                checked: true,
                // 获取的菜单类型
                type:'web',
            };
        },
        mounted(){
            let vm = this
            return
            let old = [{
                path: '/',
                menuParams: 'Home',
                name: '系统配置',
                iconCls: 'el-icon-setting',
                children: [
                    { path: '/dict', menuParams: 'sys/dict', name: '字典表' },
                    { path: '/menu', menuParams: 'sys/menu', name: '菜单表' },
                    { path: '/role', menuParams: 'sys/role', name: '角色表' },
                    { path: '/user', menuParams: 'sys/user', name: '用户表' },
                ]
            }]
            window.sessionStorage.setItem('router',JSON.stringify(old))
            MenuUtils(routers,old)
            console.log(JSON.stringify(routers))
            vm.$router.push({ path: '/dict'});
        },
        methods: {
            //登录
            login() {
                let vm = this
                this.$refs.ruleForm2.validate((valid) => {

                    if (valid) {
                        let params = {
                            account: vm.ruleForm2.account,
                            pwd: vm.ruleForm2.checkPass,
                            type: vm.type,
                        };
                        vm.logining = true;
                        post(instanceUrl.login,params).then((res) => {
                            vm.logining = false;
                            if("success" === res.status){
                                let data = Object.assign({},res.data)
                                let token = data.token
                                let userInfo = Object.assign({},data.userInfo)
                                let menuList = Object.assign([],data.menuList)
                                /**
                                 * 1.设置token
                                 * 2.设置用户信息
                                 * 3.设置当前用户菜单信息
                                 * 4.添加菜单信息
                                 * 5.跳转到主页
                                 */
                                util.setToken(token)
                                util.setUserInfo(userInfo)
                                MenuUtils(routers,menuList)
                                util.setRoutes(routers)
                                vm.$router.addRoutes(routers)
                                vm.$router.push({ path: menuList.length==0? '':menuList[0].children?menuList[0].children[0].menuUrl:''});
                                return
                            }
                            this.$message.error(res.msg);
                        }).catch((error) => {
                            vm.logining = false;
                            this.$message.error('网络异常，请稍后重试');
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            handleReset2() {
                this.$refs.ruleForm2.resetFields();
            },
            handleSubmit2(ev) {

                var _this = this;
                this.$refs.ruleForm2.validate((valid) => {

                    if (valid) {
                        //_this.$router.replace('/table');
                        this.logining = true;
                        //NProgress.start();
                        var loginParams = { username: this.ruleForm2.account, password: this.ruleForm2.checkPass };
                        requestLogin(loginParams).then(data => {
                            this.logining = false;
                            //NProgress.done();
                            let { msg, code, user } = data;
                            if (code !== 200) {
                                this.$message({
                                    message: msg,
                                    type: 'error'
                                });
                            } else {
                                this.$router.addRoutes(routers)
                                sessionStorage.setItem('user', JSON.stringify(user));
                                this.$router.push({ path: '/dict' });
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        }
    }

</script>

<style lang="scss" scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>