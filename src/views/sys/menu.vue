<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item label="菜单名称：">
					<el-input v-model="filters.menuName" placeholder="请输入菜单名称"></el-input>
				</el-form-item>
				<el-form-item label="菜单类型：">
					<el-select v-model="filters.type" placeholder="请选择菜单类型">
						<el-option
								v-for="item in typeList"
								:key="item.code"
								:label="item.value"
								:value="item.code">
						</el-option>
					</el-select>
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
		<el-table :data="menuList" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column prop="menuName" label="菜单名称" width="120" sortable>
			</el-table-column>
			<el-table-column prop="type" label="菜单类型" width="120" sortable
							 :formatter="formatType">
			</el-table-column>
			<el-table-column prop="menuUrl" label="菜单URL" width="230" sortable>
			</el-table-column>
			<el-table-column prop="menuParams" label="菜单参数" min-width="120"sortable>
			</el-table-column>
			<el-table-column prop="isDel" label="是否禁用" width="120" sortable
							 :formatter="formatDel">
			</el-table-column>
			<el-table-column label="操作" width="200">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button size="small" v-show="scope.row.isTitle==='Y'" @click="handleAddChildren(scope.row)" :disabled="scope.row.isDel==='Y'">新增子节点</el-button>
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
		<el-dialog title="新增" :close-on-click-modal="false"
				   :visible.sync="addFormVisible">
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
                    <el-input type="textarea" v-model="addForm.menuParams" />
                </el-form-item>
				<el-form-item label="是否标题" prop="isTitle" v-show="addForm.type=='web'">
					<el-radio-group v-model="addForm.isTitle">
						<el-radio class="radio" label="N">否</el-radio>
						<el-radio class="radio" label="Y">是</el-radio>
					</el-radio-group>
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
                    menuName: '',
                    type:[]
				},
                menu: [],
				/**
				 * 分页之后的数据展示
				 */
                menuList:[],
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
                    isTitle: 'N',
					parentId:'',
				},
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
                    menuName: [
                        { required: true, message: '请输入菜单名称', trigger: 'blur' }
                    ],
                    type: [
                        { required: true, message: '请选择菜单类型', trigger: 'blur' }
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
                    isTitle: 'N',
                    parentId:'',
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
		    //当前栏是否为标题
            isTitleShow(id){
				let vm = this
                let data = vm.menuList.filter((item)=>{
					if(item.parentId===id){
						return item.isTitle==="Y"
					}
				})
				return data.length === 0
			},
            //显示子节点新增界面
            handleAddChildren: function (row) {
                let vm = this
                vm.addFormVisible = true;
                vm.addForm = Object.assign({},{
                    id: '',
                    menuName: '',
                    type: vm.typeSelList[0]?vm.typeSelList[0].code:'',
                    menuUrl: '',
                    menuParams: '',
                    isDel: 'N',
                    isTitle: 'N',
                    parentId:row.id,
                });
            },
		    /**
			 * 转换菜单类型
			 */
            formatType(row, column){
                let typeDesc = row.type;
                this.typeList.filter((item)=>{
                    if(row.type===item.code){
                        return typeDesc = item.value
                    }
                })

                return typeDesc
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
                vm.menuList =  vm.menu.filter((u, index) => index < vm.size * vm.page && index >= vm.size * (vm.page - 1));
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
                    if("success" === res.status) {
                        vm.typeSelList = Object.assign([],res.data)
                        vm.typeList = Object.assign([],res.data)
                        vm.typeList.push({
                            code:"",
                            value:"全部"
                        })
						return
                    }
                    vm.$message({
                        message: msg,
                        type: 'error'
                    });
                }).catch((error) => {
                    vm.listLoading = false;
                    console.log("报错了")
                })
			},
			//获取菜单列表
			serch() {
			    let vm = this
				let params = {
					// page: vm.page,
					// size: vm.size,
                    menuName: vm.filters.menuName,
                    type: vm.filters.type?vm.filters.type:""
				};
                vm.listLoading = true;
                post(instanceUrl.getMenu,params).then((res) => {
                    vm.listLoading = false;
					if("success" === res.status){
                        vm.total = res.data.length;
                        vm.menu = res.data;
                        vm.menuList = res.data.filter((u, index) => index < vm.size * vm.page && index >= vm.size * (vm.page - 1));
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
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editLoading = false;
				this.editForm = Object.assign({}, row);
			},

			//显示新增界面
			handleAdd: function () {
                let vm = this
                vm.addFormVisible = true;
                vm.addForm = Object.assign({},{
                    id: '',
                    menuName: '',
                    type:  vm.typeSelList[0]?vm.typeSelList[0].code:'',
                    menuUrl: '',
                    menuParams: '',
                    isDel: 'N',
                    isTitle: 'N',
                    parentId:'',
                });
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
                            vm.addForm.menuUrl?vm.addForm.menuUrl===""?"/":vm.addForm.menuUrl:vm.addForm.menuUrl
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
                                    return
                                }
                                vm.$message({
                                    message: res.msg,
                                    type: 'error'
                                });
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