<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item label="昵称：">
					<el-input v-model="filters.nickName" placeholder="昵称"></el-input>
				</el-form-item>
				<el-form-item label="账号：">
					<el-input v-model="filters.account" placeholder="账号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="serch">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="userList" highlight-current-row v-loading="listLoading" style="width: 100%;height:100%;">
			<el-table-column prop="nickName" label="昵称" width="100" sortable>
			</el-table-column>
			<el-table-column prop="account" label="账号" width="150" sortable>
			</el-table-column>
			<el-table-column prop="phone" label="手机号" min-width="120" sortable>
			</el-table-column>
			<el-table-column prop="gender" label="性别" width="120" sortable
							 :formatter="formatGender">
			</el-table-column>
			<!--<el-table-column prop="city" label="城市" min-width="120" sortable>-->
			<!--</el-table-column>-->
			<!--<el-table-column prop="province" label="省份" min-width="120" sortable>-->
			<!--</el-table-column>-->
			<!--<el-table-column prop="country" label="国家" min-width="120" sortable>-->
			<!--</el-table-column>-->
			<el-table-column prop="openId" label="微信ID" width="285" sortable>
			</el-table-column>
			<el-table-column prop="token" label="登录凭证" min-width="285" sortable>
			</el-table-column>
			<el-table-column prop="lastLoginDate" label="最后登录时间" min-width="150" sortable>
			</el-table-column>
			<el-table-column prop="isDel" label="是否禁用" min-width="120" sortable
							 :formatter="formatDel">
			</el-table-column>
			<el-table-column label="操作" width="100">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">{{scope.row.isDel==='N'?'禁用':"启用"}}</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="size" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
	</section>
</template>

<script>
    import post from '../../api/axiosApi'
    import instanceUrl from '../../api/interfaceName'
    import utils from '../../api/variable'

    export default {
        data() {
            return {
                /**
                 * 过滤条件
                 */
                filters: {
                    nickName: '',
                    account: ''
                },
                user: [],
                /**
                 * 分页之后的数据展示
                 */
                userList:[],
                total: 0,
                page: 1,
                size:utils.size,
                listLoading: false,
            }
        },
        mounted() {
            this.serch();
        },
        methods: {
            /**
             * 男女转换
             */
            formatGender: function (row, column) {
                return row.gender == '1' ? '男' : row.gender == '2' ? '女' : '未知';
            },
            /**
             * 是否禁用转换
             */
            formatDel: function (row, column) {
                return row.isDel == 'N' ? '否' : row.isDel == 'Y' ? '是' : '未知';
            },
            /**
             * 分页显示数据
             * @param val
             */
            handleCurrentChange(val) {
                let vm = this
                vm.page = val;
                vm.userList =  vm.user.filter((u, index) => index < vm.size * vm.page && index >= vm.size * (vm.page - 1));
            },
            //获取用户列表
            serch() {
                let vm = this
                let params = {
                    nickName: vm.filters.nickName,
                    account: vm.filters.account,
                };
                vm.listLoading = true;
                post(instanceUrl.getUser,params).then((res) => {
                    vm.listLoading = false;
                    if("success" == res.status){
                        vm.total = res.data.length;
                        vm.user = res.data;
                        vm.userList = res.data.filter((u, index) => index < vm.size * vm.page && index >= vm.size * (vm.page - 1));
                        return
                    }
                    vm.$message({
                        message: res.msg,
                        type: 'error'
                    });
                }).catch((error) => {
                    vm.listLoading = false;
                    console.log("报错了")
                })
            },
            //禁用客户
            handleEdit: function (index, row) {
                let vm = this
                vm.$confirm('确认'+(row.isDel==='N'?'禁用':'启用')+'该用户吗？', '提示', {}).then(() => {
                    row.isDel = row.isDel==="N"?"Y":"N"
                    let params = Object.assign({},row)
                    vm.editLoading = true;
                    post(instanceUrl.editUser,params).then((res) => {
                        vm.editLoading = true;
                        if("success" === res.status){
                            //关闭修改窗
                            vm.editFormVisible = false;
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                            });
                            vm.serch();
                        }else{
                            this.$message({
                                message: '修改异常',
                                type: 'error'
                            });
                        }
                    }).catch((error) => {
                        console.log("报错了")
                    })
                });
            },
        }
    }

</script>

<style scoped>

</style>