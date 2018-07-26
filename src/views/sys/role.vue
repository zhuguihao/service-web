<template>
	<section>
		<!--工具条-->
		<div>
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true" :model="filters">
					<el-form-item label="角色代码：">
						<el-input v-model="filters.groupCode" placeholder="请输入角色代码"></el-input>
					</el-form-item>
					<el-form-item label="角色名称：">
						<el-input v-model="filters.groupName" placeholder="请输入角色名称"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" v-on:click="serch">查询</el-button>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="handleAdd">新增</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		</div>

		<div style="float: left;width: 100%;">

			<el-tree :data="groupList"
					 node-key="id"
					 :props="props"
					 default-expand-all
					 :expand-on-click-node="false">
			  <span class="custom-tree-node" slot-scope="{ node, data }">
				<span>{{ data.groupName }}</span>
				<span>
					<el-button class="btnDel" type="text" size="mini" icon="el-icon-delete" @click="() => removeGroup(node, data)" v-show="data.children.length ===0">
						删除
					  </el-button>
				  <el-button class="btnAdd" type="text" size="mini" icon="el-icon-plus" @click="() => addGroup(data)">
					新增
				  </el-button>
					<el-button class="btnEdit" type="text" size="mini" icon="el-icon-edit" @click="() => addGroup(data)">
					编辑
				  </el-button>
					<el-button type="text" size="mini" icon="el-icon-menu" @click="() => removeGroup(node, data)">
					配置角色菜单
				  </el-button>
				</span>
			  </span>
			</el-tree>

		</div>

		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="角色代码" prop="groupCode">
					<el-input v-model="editForm.groupName" auto-complete="off" />
				</el-form-item>
				<el-form-item label="角色名称" prop="groupName">
					<el-input v-model="editForm.groupName" auto-complete="off" />
				</el-form-item>
				<el-form-item label="是否禁用">
					<el-radio-group v-model="editForm.isDel">
						<el-radio class="radio" label="N">否</el-radio>
						<el-radio class="radio" label="Y">是</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible":close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="角色代码" prop="groupCode">
					<el-input v-model="addForm.groupName" auto-complete="off" />
				</el-form-item>
				<el-form-item label="角色名称" prop="groupName">
					<el-input v-model="addForm.groupName" auto-complete="off" />
				</el-form-item>
                <el-form-item label="是否禁用">
                    <el-radio-group v-model="addForm.isDel">
                        <el-radio class="radio" label="N">否</el-radio>
                        <el-radio class="radio" label="Y">是</el-radio>
                    </el-radio-group>
                </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
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
                    groupCode: '',
                    groupName: '',
				},
                group: [],
				/**
				 * 分页之后的数据展示
				 */
                groupList:[],
				total: 0,
				page: 1,
				size:utils.size,
				listLoading: false,
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
                    groupCode: [
                        { required: true, message: '请输入角色代码', trigger: 'blur' }
                    ],
                    groupName: [
                        { required: true, message: '请输入角色名称', trigger: 'blur' }
                    ]
				},
				//编辑界面数据
				editForm: {
					id: '',
                    menuName: '',
                    type: '',
                    menuUrl: '',
                    menuParams: '',
                    isDel: 'N',
				},
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
                    groupCode: [
                        { required: true, message: '请输入角色代码', trigger: 'blur' }
                    ],
                    groupName: [
                        { required: true, message: '请输入角色名称', trigger: 'blur' }
                    ]
				},
				//新增界面数据
				addForm: {
                    id: '',
                    menuName: '',
                    type: '',
                    menuUrl: '',
                    menuParams: '',
                    isDel: 'N',
				},
				//菜单类型
                typeList:[],
				//菜单转换值
                props:{
                    label: 'groupName'
                },
				//菜单类型集合
                typeSelList:[],

			}
		},
		methods: {
            // renderContent(h, { node, data, store }) {
            //     return (
            //         <span class="custom-tree-node">
            //         <span>{node.label}</span>
            //     <span>
            //     <el-button size="mini" type="text" on-click={ () => this.append(data) }>Append</el-button>
            //     <el-button size="mini" type="text" on-click={ () => this.remove(node, data) }>Delete</el-button>
            //     </span>
            //     </span>);
            // },
            handleNodeClick(data) {
                console.log(data);
            },
            /**
             * 是否禁用转换
             */
            formatDel: function (row, column) {
				return row.isDel == 'N' ? '否' : row.isDel == 'Y' ? '是' : '未知';
			},
			handleCurrentChange(val) {
                let vm = this
                vm.page = val;
                vm.groupList =  vm.group.filter((u, index) => index < vm.size * vm.page && index >= vm.size * (vm.page - 1));
			},
            /**
			 * 获取菜单类型数据字典
             */
            getDictType(){
                let vm = this
                let params = {
                    code:"menuType"
                };
                vm.listLoading = true;
                post(instanceUrl.getDictList,params).then((res) => {
                    vm.listLoading = false;
                    console.log("成功回调："+JSON.stringify(res))
                    if("success" === res.status) {
                        vm.typeSelList = Object.assign([],res.data)
                        vm.typeList = Object.assign([],res.data)
                        vm.typeList.push({
                            code:"",
                            value:"全部"
                        })
                    }else{
                        console.log(res.msg)
					}
                }).catch((error) => {
                    vm.listLoading = false;
                    console.log("报错了")
                })
			},
			//获取用户列表
			serch() {
			    let vm = this
				let params = {
					// page: vm.page,
					// size: vm.size,
                    groupCode: vm.filters.groupCode,
                    groupName: vm.filters.groupName
				};
                vm.listLoading = true;
                post(instanceUrl.getGroup,params).then((res) => {
                    vm.listLoading = false;
                    console.log("成功回调："+JSON.stringify(res))
					if("success" === res.status){
                        vm.total = res.data.length;
                        vm.group = res.data;
                        vm.groupList = res.data.filter((u, index) => index < vm.size * vm.page && index >= vm.size * (vm.page - 1));
					}else{
                        console.log(res.msg)
					}
                }).catch((error) => {
                    vm.listLoading = false;
                    console.log("报错了")
                })
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editLoading = false;
				this.editForm = Object.assign({}, row);
			},

			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
                    id: '',
                    menuName: '',
                    type: '',
                    menuUrl: '',
                    menuParams: '',
                    isDel: 'N',
				};
			},
			//编辑
			editSubmit: function () {
			    let vm = this
                vm.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {

							//NProgress.start();
							let params = Object.assign({}, this.editForm);
                            vm.editLoading = true;
                            post(instanceUrl.editMenu,params).then((res) => {
                                vm.editLoading = false;
                                vm.listLoading = false;
                                //rest表单
                                vm.$refs['editForm'].resetFields();
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
                                vm.listLoading = false;
                                console.log("报错了")
                            })
						});
					}
				});
			},
			//新增
			addSubmit: function () {
                let vm = this
                vm.$refs.addForm.validate((valid) => {
					if (valid) {
                        vm.$confirm('确认提交吗？', '提示', {}).then(() => {
							//NProgress.start();
							let params = Object.assign({}, vm.addForm);
                            vm.addLoading = true;
                            post(instanceUrl.addMenu,params).then((res) => {
                                vm.addLoading = false;
                                //NProgress.done();
                                vm.$refs['addForm'].resetFields();
                                if("success" === res.status){
                                    //关闭新增窗口
                                    vm.addFormVisible = false;
                                    vm.$message({
                                        message: '新增成功',
                                        type: 'success'
                                    });
                                    vm.serch();
                                }else{
                                    vm.$message({
                                        message: '新增异常',
                                        type: 'error'
                                    });
                                }
                            }).catch((error) => {
                                console.log("报错了")
                            })
						});
					}
				});
			},
            addGroup(data){
                console.log(JSON.stringify(data))
				console.log("id:"+data.id)
			},
            removeGroup(node,data){
                console.log(node)
                console.log(JSON.stringify(data))
			},
		},
        mounted() {
            this.serch();
            this.getDictType()
        }
	}

</script>

<style scoped>
	.custom-tree-node {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		padding-right: 8px;
		/*background-color: ;*/
	}
	.btnDel{
		color: #F56C6C;
	}
	.btnEdit{
		color: #E6A23C;
	}
	.btnAdd{
		color: #67C23A;
	}
</style>