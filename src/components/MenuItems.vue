<template>
	<div>
		<template v-for="(navMenu,index) in navMenus"  v-if="!navMenu.hidden">
			<el-menu-item v-if="navMenu.children&&navMenu.isTitle==='N'"
						  :key="navMenu.id" :data="navMenu" :index="navMenu.menuUrl" >
				<i :class="navMenu.menuIcon"></i>
				<span slot="title">{{navMenu.menuName}}</span>
			</el-menu-item>

			<el-submenu v-if="navMenu.children &&navMenu.isTitle==='Y'"
						:key="navMenu.id" :data="navMenu" :index="navMenu.menuUrl">
				<!--:index="index+''"-->
				<template slot="title">
					<i :class="navMenu.menuIcon"></i>
					<span> {{navMenu.menuName}}</span>
				</template>
				<nav-menu :navMenus="navMenu.children"></nav-menu>
			</el-submenu>
		</template>
	</div>
</template>

<script>
    export default {
        name: 'nav-menu',
        props: ['navMenus'],
        data() {
            return {}
        },
        methods: {}
    }
</script>

<style scoped>

</style>