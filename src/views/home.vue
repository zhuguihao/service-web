<template>
  <div class="home">
    <el-menu  class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">处理中心</el-menu-item>
      <el-submenu index="2">
        <template slot="title">我的工作台</template>
        <el-menu-item index="2-1">选项1</el-menu-item>
        <el-menu-item index="2-2">选项2</el-menu-item>
        <el-menu-item index="2-3">选项3</el-menu-item>
        <el-submenu index="2-4">
          <template slot="title">选项4</template>
          <el-menu-item index="2-4-1">选项1</el-menu-item>
          <el-menu-item index="2-4-2">选项2</el-menu-item>
          <el-menu-item index="2-4-3">选项3</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-menu-item index="3" disabled>消息中心</el-menu-item>
      <el-menu-item index="4">订单管理</el-menu-item>
    </el-menu>
    <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
      <el-radio-button :label="false">展开</el-radio-button>
      <el-radio-button :label="true">收起</el-radio-button>
    </el-radio-group>
    <template v-for="(router,index) in $router.options.routes">
      <div v-bind:key="index">
        <el-menu class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span slot="title" v-text="router.chName"></span>
            </template>
            <template v-for="(children,childrenIndex) in router.children" v-if="router.children && router.children.length>0">
              <div  v-bind:key="childrenIndex">
                <el-menu-item-group>
                  <span slot="title" v-text="children.groupName"></span>
                  <el-menu-item :index="childrenIndex.toString()" v-text="children.chName"></el-menu-item>
                </el-menu-item-group>
              </div>
            </template>
          </el-submenu>
        </el-menu>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      isCollapse: true
    }
  },
  mounted () {
    console.log(JSON.stringify(this.$router.options.routes))
  },
  methods: {
    handleSelect (tab, event) {
      console.log(tab, event)
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    /*min-height: 400px;*/
  }
</style>
