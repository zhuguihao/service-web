<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item label="代码：">
					<el-input v-model="filters.code" placeholder="代码"></el-input>
				</el-form-item>
				<el-form-item label="值：">
					<el-input v-model="filters.value" placeholder="值"></el-input>
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
		<el-table :data="dictList" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column prop="code" label="代码" width="120" sortable>
			</el-table-column>
			<el-table-column prop="parentId" label="父级代码" width="120" sortable
							 :formatter="formatCode">
			</el-table-column>
			<el-table-column prop="value" label="值" width="100" sortable>
			</el-table-column>
			<el-table-column prop="remarks" label="描述" min-width="120" sortable>
			</el-table-column>
			<el-table-column prop="isDel" label="是否禁用" width="120" sortable
							 :formatter="formatDel">
			</el-table-column>
			<el-table-column label="操作" width="200">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button size="small" @click="handleAddChildren(scope.$index, scope.row)">新增子节点</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="size" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="父级节点" prop="parentId">
					<el-input v-model="editForm.parentId" auto-complete="off" disabled/>
				</el-form-item>
				<el-form-item label="代码" prop="code">
					<el-input v-model="editForm.code" auto-complete="off" disabled/>
				</el-form-item>
				<el-form-item label="值" prop="value">
					<el-input v-model="editForm.value" auto-complete="off" />
				</el-form-item>
				<el-form-item label="描述" prop="remarks">
					<!--<el-input v-model="editForm.remarks" auto-complete="off"></el-input>-->
					<el-input type="textarea" v-model="editForm.remarks" />
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
		<el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="代码" prop="code">
					<el-input v-model="addForm.code" auto-complete="off"/>
				</el-form-item>
				<el-form-item label="值" prop="value">
					<el-input v-model="addForm.value" auto-complete="off" />
				</el-form-item>
				<el-form-item label="描述" prop="remarks" auto-complete="off" >
					<!--<el-input v-model="editForm.remarks" auto-complete="off"></el-input>-->
					<el-input type="textarea" v-model="addForm.remarks" />
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
					code: '',
                    value: ''
				},
				dict: [],
				/**
				 * 分页之后的数据展示
				 */
				dictList:[],
				total: 0,
				page: 1,
				size:utils.size,
				listLoading: false,
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
                    code: [
                        { required: true, message: '请输入代码', trigger: 'blur' }
                    ],
					value: [
						{ required: true, message: '请输入值', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id: '',
					code: '',
					value: '',
					isDel: 'N',
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
                    code: [
                        { required: true, message: '请输入代码', trigger: 'blur' }
                    ],
					value: [
                        { required: true, message: '请输入值', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
                    id: '',
					parentId:'',
                    code: '',
                    value: '',
                    isDel: "N",
				}

			}
		},
		methods: {

            /**
			 * 父节点ID转换成父节点Code
             */
            formatCode(row, column) {
                let vm = this
                if(row.parentId){
                    let items ={}
                    let data = vm.dict.filter(item => {
                        if(row.parentId === item.id){
                            items = item
                            return true
						}
					})
					return data.length>0?items.code: row.parentId;
                }
                return row.parentId;
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
                vm.dictList =  vm.dict.filter((u, index) => index < vm.size * vm.page && index >= vm.size * (vm.page - 1));
			},
			//获取用户列表
			serch() {
			    let vm = this
				let params = {
					// page: vm.page,
					// size: vm.size,
                    code: vm.filters.code,
                    value: vm.filters.value,
				};
                vm.listLoading = true;
                post(instanceUrl.getDictUrl,params).then((res) => {
                    vm.listLoading = false;
                    console.log("成功回调："+JSON.stringify(res))
                    vm.total = res.data.length;
                    vm.dict = res.data;
                    vm.dictList = res.data.filter((u, index) => index < vm.size * vm.page && index >= vm.size * (vm.page - 1));
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
            //显示子节点新增界面
            handleAddChildren: function (index, row) {
                this.addFormVisible = true;
                this.addForm = {
                    id: '',
                    parentId:row.id,
                    code: '',
                    value: '',
                    isDel: "N",
                };
            },
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
                    id: '',
                    parentId:'',
                    code: '',
                    value: '',
                    isDel: "N",
				};
			},
			//编辑
			editSubmit: function () {
			    let vm = this
                vm.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            vm.editLoading = true;
							//NProgress.start();
							let params = Object.assign({}, this.editForm);
							console.log(JSON.stringify(params))
							// para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                            post(instanceUrl.editDict,params).then((res) => {
                                vm.editLoading = true;
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
                                console.log("报错了")
                            })
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							//NProgress.start();
							let params = Object.assign({}, this.addForm);
                            this.addLoading = true;
                            post(instanceUrl.addDict,params).then((res) => {
                                this.addLoading = false;
                                //NProgress.done();
                                this.$refs['addForm'].resetFields();
                                if("success" === res.status){
                                    //关闭新增窗口
                                    this.addFormVisible = false;
                                    this.$message({
                                        message: '新增成功',
                                        type: 'success'
                                    });
                                    vm.serch();
                                }else{
                                    this.$message({
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
		},
        mounted() {
            this.serch();
        }
	}

</script>

<style scoped>

</style>