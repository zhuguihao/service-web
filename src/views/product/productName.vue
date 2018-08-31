<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item label="产品系列：">
					<el-select v-model="filters.tSeriesId" placeholder="请选择产品系列"
							   @focus="getProductSeries"
							   :loading="seriesLoading">
						<!--@change="proNameChange"-->
						<el-option
								v-for="item in productSeriesList"
								:key="item.id"
								:label="item.series"
								:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="代码：">
					<el-input v-model="filters.proCode" placeholder="请输入代码"></el-input>
				</el-form-item>
				<el-form-item label="名称：">
					<el-input v-model="filters.proName" placeholder="请输入名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getProductName">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="productNameList" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column prop="proCode" label="代码" width="120" sortable>
			</el-table-column>
			<el-table-column prop="proName" label="名称" min-width="120" sortable>
			</el-table-column>
			<el-table-column prop="sort" label="排序" width="80" sortable>
			</el-table-column>
			<el-table-column prop="delFlag" label="是否禁用" width="120" sortable
							 :formatter="formatDel">
			</el-table-column>
			<el-table-column label="操作" width="100">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="size" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑产品名称" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="产品系列：" prop="tSeriesId">
					<el-select v-model="editForm.tSeriesId" placeholder="请选择产品系列"
							   :loading="seriesLoading">
						<el-option
								v-for="item in productSeries"
								:key="item.id"
								:label="item.series"
								:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="产品名称代码" prop="proCode">
					<el-input v-model="editForm.proCode" auto-complete="off" />
				</el-form-item>
				<el-form-item label="产品名称" prop="proName">
					<el-input v-model="editForm.proName" auto-complete="off" />
				</el-form-item>
				<el-form-item label="排序号" prop="sort">
					<el-input v-model="editForm.sort" auto-complete="off" />
				</el-form-item>
				<el-form-item label="是否禁用">
					<el-radio-group v-model="editForm.delFlag">
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
		<el-dialog title="新增产品名称" :close-on-click-modal="false"
				   :visible.sync="addFormVisible">
			<el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="产品系列：" prop="tSeriesId">
					<el-select v-model="addForm.tSeriesId" placeholder="请选择产品系列"
							   @focus="getProductSeries"
							   :loading="seriesLoading">
						<el-option
								v-for="item in productSeries"
								:key="item.id"
								:label="item.series"
								:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
                <el-form-item label="产品名称代码" prop="proCode">
                    <el-input v-model="addForm.proCode" auto-complete="off" />
                </el-form-item>
				<el-form-item label="产品名称" prop="proName">
					<el-input v-model="addForm.proName" auto-complete="off" />
				</el-form-item>
				<el-form-item label="排序号" prop="sort">
					<el-input v-model="addForm.sort" auto-complete="off" />
				</el-form-item>
                <el-form-item label="是否禁用">
                    <el-radio-group v-model="addForm.delFlag">
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
                    proCode: '',
                    proName: '',
                    tSeriesId: '',
				},
                productName: [],
				/**
				 * 分页之后的数据展示
				 */
                productNameList:[],
				total: 0,
				page: 1,
				size:utils.size,
				listLoading: false,
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
                    tSeriesId: [
                        { required: true, message: '请选择产品系列', trigger: 'blur' }
                    ],
                    proCode: [
                        { required: true, message: '请输入产品系列代码', trigger: 'blur' }
                    ],
                    proName: [
                        { required: true, message: '请输入产品系列名称', trigger: 'blur' }
                    ],
                    sort: [
                        { required: true, message: '请输入排序号', trigger: 'blur' }
                    ]
				},
				//编辑界面数据
				editForm: {
                    id: '',
                    proCode: '',
                    proName: '',
                    sort: 1,
                    delFlag: "N",
				},
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
                    tSeriesId: [
                        { required: true, message: '请选择产品系列', trigger: 'blur' }
                    ],
                    proCode: [
                        { required: true, message: '请输入产品系列代码', trigger: 'blur' }
                    ],
                    proName: [
                        { required: true, message: '请输入产品系列名称', trigger: 'blur' }
                    ],
                    sort: [
                        { required: true, message: '请输入排序号', trigger: 'blur' }
                    ]
				},
				//新增界面数据
				addForm: {
                    id: '',
                    tSeriesId:'',
                    proCode: '',
                    proName: '',
                    sort: 1,
                    delFlag: "N",
				},
				//产品系列
                productSeries:[],
				//产品列表条件查询
                productSeriesList:[],
				seriesLoading:false,
				//查询条件选择的系列ID
                productSeriesId:'',
			}
		},
		methods: {
            /**
             * 获取产品系列表数据接口
             */
            getProductSeries(){
                let vm = this
                vm.productSeriesList = []
                let params = {}
                vm.seriesLoading = true;
                post(instanceUrl.getProductSeries,params).then((res) => {
                    vm.seriesLoading = false;
                    if("success" === res.status) {
                        vm.total = res.data.length;
                        vm.productSeries = Object.assign([],res.data)
                        let data = []
                        data.push({
                            id:'',
                            series:'全部'
						});
                        res.data.forEach((item)=>{
                            data.push(item)
						})
                        vm.productSeriesList = Object.assign([],data)
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
            /**
             * 获取产品名称表数据接口
             */
            getProductName(){
                let vm = this
                let params = {
                    proCode:vm.filters.proCode,
                    proName:vm.filters.proName,
                    tSeriesId:vm.filters.tSeriesId,
                }
                vm.listLoading = true;
                post(instanceUrl.getProductName,params).then((res) => {
                    vm.listLoading = false;
                    if("success" === res.status) {
                        vm.total = res.data.length;
                        vm.productName = res.data;
                        vm.productNameList = res.data.filter((u, index) => index < vm.size * vm.page && index >= vm.size * (vm.page - 1));
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
            /**
             * 是否禁用转换
             */
            formatDel: function (row, column) {
				return row.delFlag == 'N' ? '否' : row.delFlag == 'Y' ? '是' : '未知';
			},
			handleCurrentChange(val) {
                let vm = this
                vm.page = val;
                vm.productNameList =  vm.productName.filter((u, index) => index < vm.size * vm.page && index >= vm.size * (vm.page - 1));
			},

			//显示编辑界面
			handleEdit: function (index, row) {
                this.getProductSeries()
				this.editFormVisible = true;
				this.editLoading = false;
				this.editForm = Object.assign({}, row);
			},

			//显示新增界面
			handleAdd: function () {
                let vm = this
                vm.addFormVisible = true
                vm.addForm = Object.assign({}, {
                    id: '',
                    proCode: '',
                    proName: '',
                    sort: 1,
                    delFlag: "N",
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
                            post(instanceUrl.productNameUpdate,params).then((res) => {
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
                                    vm.getProductName();
                                    return
                                }
                                vm.$message({
                                    message: res.msg,
                                    type: 'error'
                                });
                            }).catch((error) => {
                                vm.listLoading = false
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
                            post(instanceUrl.productNameInsert,params).then((res) => {
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
                                    vm.getProductName();
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
            this.getProductName();
            this.getProductSeries()
        }
	}

</script>

<style scoped>

</style>