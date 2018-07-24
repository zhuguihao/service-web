<template>
	<section>
		<!--工具条-->
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

		<!--列表-->
		<el-table :data="groupList" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column prop="groupCode" label="角色代码" min-width="120" sortable>
			</el-table-column>
			<el-table-column prop="groupName" label="角色名称" min-width="120" sortable>
			</el-table-column>
			<el-table-column prop="isDel" label="是否禁用" width="120" sortable
							 :formatter="formatDel">
			</el-table-column>
			<el-table-column label="操作" width="120">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<!--<el-button size="small" @click="handleAddChildren(scope.$index, scope.row)">新增子节点</el-button>-->
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="size" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="菜单名称" prop="menuName">
					<el-input v-model="editForm.menuName" auto-complete="off" />
				</el-form-item>
				<el-form-item label="菜单类型" prop="type">
				<el-select v-model="editForm.type" placeholder="请选择菜单类型">
						<el-option
								v-for="t in typeSelList"
								:key="t.code"
								:label="t.value"
								:value="t.code">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="菜单URL" prop="menuUrl">
					<el-input v-model="editForm.menuUrl" auto-complete="off" />
				</el-form-item>
				<el-form-item label="菜单参数" prop="menuParams">
					<!--<el-input v-model="editForm.remarks" auto-complete="off"></el-input>-->
					<el-input type="textarea" v-model="editForm.menuParams" />
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
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="菜单名称" prop="menuName">
                    <el-input v-model="addForm.menuName" auto-complete="off" />
                </el-form-item>
                <el-form-item label="菜单类型" prop="type">
                    <el-select v-model="addForm.type" placeholder="请选择菜单类型">
                        <el-option
                                v-for="t in typeSelList"
                                :key="t.code"
                                :label="t.value"
                                :value="t.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="菜单URL" prop="menuUrl">
                    <el-input v-model="addForm.menuUrl" auto-complete="off" />
                </el-form-item>
                <el-form-item label="菜单参数" prop="menuParams">
                    <!--<el-input v-model="editForm.remarks" auto-complete="off"></el-input>-->
                    <el-input type="textarea" v-model="addForm.menuParams" />
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
                    menuName: [
                        { required: true, message: '请输入菜单名称', trigger: 'blur' }
                    ],
                    type: [
						{ required: true, message: '请选择菜单类型', trigger: 'blur' }
					],
                    menuUrl: [
                        { required: true, message: '请输入菜单地址', trigger: 'blur' }
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
                    menuName: [
                        { required: true, message: '请输入菜单名称', trigger: 'blur' }
                    ],
                    type: [
                        { required: true, message: '请选择菜单类型', trigger: 'blur' }
                    ],
                    menuUrl: [
                        { required: true, message: '请输入菜单地址', trigger: 'blur' }
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
                    value: 'code',
                    label: 'value'
                },
				//菜单类型集合
                typeSelList:[]
			}
		},
		methods: {
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
			}
		},
        mounted() {
            this.serch();
            this.getDictType()
        }
	}

</script>

<style scoped>

</style>