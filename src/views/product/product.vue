<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item label="产品系列：">
					<el-select v-model="filters.tSeriesId" placeholder="请选择产品系列"
							   @focus="getProductSeries"
							   :loading="seriesSelLoading">
						<el-option
								v-for="item in productSeriesList"
								:key="item.id"
								:label="item.series"
								:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="产品名称：">
					<el-select v-model="filters.proNameId" placeholder="请选择产品名称"
							   @focus="getProductName"
							   :loading="proNameLoading">
						<el-option
								v-for="item in productNameList"
								:key="item.id"
								:label="item.proName"
								:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="产品型号：">
					<el-input v-model="filters.proModel" placeholder="请输入产品型号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getProduct">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--  列表  -->
		<el-table :data="productList" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column prop="tSeriesId" label="产品系列" width="260" sortable
							 :formatter="formatSeries">
			</el-table-column>
			<el-table-column prop="proNameId" label="产品名称" width="260" sortable
							 :formatter="formatName">
			</el-table-column>
			<el-table-column prop="proModel" label="产品型号" width="200" sortable>
			</el-table-column>
			<el-table-column prop="voltageRange" label="电压范围" min-width="150" sortable>
			</el-table-column>
			<el-table-column prop="distributionPrice" label="经销价" min-width="120" sortable>
			</el-table-column>
			<el-table-column prop="retailPrice" label="零售价" min-width="120" sortable>
			</el-table-column>
			<el-table-column prop="policy" label="产品政策-报修(年)" min-width="160" sortable>
			</el-table-column>
			<el-table-column prop="policyReplace" label="产品政策-更换(年)" min-width="160" sortable>
			</el-table-column>
			<el-table-column prop="proDesc" label="产品描述" min-width="500" sortable>
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
		<el-dialog title="编辑产品" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="产品系列：">
					<el-select v-model="editForm.tSeriesId" placeholder="请选择产品系列"
							   @focus="getProductSeries"
							   :loading="seriesSelLoading">
						<el-option
								v-for="item in productSeries"
								:key="item.id"
								:label="item.series"
								:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="产品名称：">
					<el-select v-model="editForm.proNameId" placeholder="请选择产品名称"
							   @focus="getProductName"
							   :loading="proNameLoading">
						<el-option
								v-for="item in productName"
								:key="item.id"
								:label="item.proName"
								:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="产品系列" prop="tSeriesId">
					<el-input v-model="editForm.tSeriesId" auto-complete="off" />
				</el-form-item>
				<el-form-item label="产品名称" prop="proNameId">
					<el-input v-model="editForm.proNameId" auto-complete="off" />
				</el-form-item>
				<el-form-item label="产品型号" prop="proModel">
					<el-input v-model="editForm.proModel" auto-complete="off" />
				</el-form-item>
				<el-form-item label="电压范围" prop="voltageRange">
					<el-input v-model="editForm.voltageRange" auto-complete="off" />
				</el-form-item>
				<el-form-item label="经销价" prop="distributionPrice">
					<el-input v-model="editForm.distributionPrice" auto-complete="off" />
				</el-form-item>
				<el-form-item label="零售价" prop="retailPrice">
					<el-input v-model="editForm.retailPrice" auto-complete="off" />
				</el-form-item>
				<el-form-item label="产品政策-报修(年)" prop="policy">
					<el-input v-model="editForm.policy" auto-complete="off" />
				</el-form-item>
				<el-form-item label="产品政策-更换(年)" prop="policyReplace">
					<el-input v-model="editForm.policyReplace" auto-complete="off" />
				</el-form-item>
				<el-form-item label="产品描述" prop="proDesc">
					<el-input v-model="editForm.proDesc" auto-complete="off" />
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
		<el-dialog title="新增产品" :close-on-click-modal="false"
				   :visible.sync="addFormVisible">
			<el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="产品系列：" prop="tSeriesId">
					<el-select v-model="addForm.tSeriesId" placeholder="请选择产品系列"
							   @focus="getProductSeries"
							   :loading="seriesSelLoading">
						<el-option
								v-for="item in productSeries"
								:key="item.id"
								:label="item.series"
								:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="产品名称：" prop="proNameId">
					<el-select v-model="addForm.proNameId" placeholder="请选择产品名称"
							   @focus="getProductName"
							   :loading="proNameLoading">
						<el-option
								v-for="item in productName"
								:key="item.id"
								:label="item.proName"
								:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="产品系列" prop="tSeriesId">
					<el-input v-model="editForm.tSeriesId" auto-complete="off" />
				</el-form-item>
				<el-form-item label="产品名称" prop="proNameId">
					<el-input v-model="addForm.proNameId" auto-complete="off" />
				</el-form-item>
				<el-form-item label="产品型号" prop="proModel">
					<el-input v-model="addForm.proModel" auto-complete="off" />
				</el-form-item>
				<el-form-item label="电压范围" prop="voltageRange">
					<el-input v-model="addForm.voltageRange" auto-complete="off" />
				</el-form-item>
				<el-form-item label="经销价" prop="distributionPrice">
					<el-input v-model="addForm.distributionPrice" auto-complete="off" />
				</el-form-item>
				<el-form-item label="零售价" prop="retailPrice">
					<el-input v-model="addForm.retailPrice" auto-complete="off" />
				</el-form-item>
				<el-form-item label="产品政策-报修(年)" prop="policy">
					<el-input v-model="addForm.policy" auto-complete="off" />
				</el-form-item>
				<el-form-item label="产品政策-更换(年)" prop="policyReplace">
					<el-input v-model="addForm.policyReplace" auto-complete="off" />
				</el-form-item>
				<el-form-item label="产品描述" prop="proDesc">
					<el-input v-model="addForm.proDesc" auto-complete="off" />
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
                    tSeriesId: '',
                    proNameId: '',
                    proModel: '',
				},
                product: [],
				/**
				 * 分页之后的数据展示
				 */
                productList:[],
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
                    proNameId: [
                        { required: true, message: '请选择产品名称', trigger: 'blur' }
                    ],
                    proModel: [
                        { required: true, message: '请输入产品型号', trigger: 'blur' }
                    ],
                    voltageRange: [
                        { required: true, message: '请输入电压范围', trigger: 'blur' }
                    ],
                    proDesc: [
                        { required: true, message: '请输入产品描述', trigger: 'blur' }
                    ],
                    sort: [
                        { required: true, message: '请输入排序号', trigger: 'blur' }
                    ]
				},
				//编辑界面数据
				editForm: {
                    id: '',
                    proNameId: '',
                    proModel: '',
                    voltageRange: '',
                    distributionPrice: '',
                    retailPrice: '',
                    proDesc: '',
                    policy: '',
                    policyReplace: '',
                    sort: 1,
                    delFlag: "N",
				},
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
                    tSeriesId: [
                        { required: true, message: '请选择产品系列', trigger: 'blur' }
                    ],
                    proNameId: [
                        { required: true, message: '请选择产品名称', trigger: 'blur' }
                    ],
                    proModel: [
                        { required: true, message: '请输入产品型号', trigger: 'blur' }
                    ],
                    voltageRange: [
                        { required: true, message: '请输入电压范围', trigger: 'blur' }
                    ],
                    proDesc: [
                        { required: true, message: '请输入产品描述', trigger: 'blur' }
                    ],
                    sort: [
                        { required: true, message: '请输入排序号', trigger: 'blur' }
                    ]
				},
				//新增界面数据
				addForm: {
                    id: '',
                    proNameId: '',
                    proModel: '',
                    voltageRange: '',
                    distributionPrice: '',
                    retailPrice: '',
                    proDesc: '',
                    policy: '',
                    policyReplace: '',
                    sort: 1,
                    delFlag: "N",
				},
				//产品名称列表
                productName: [],
                productNameList: [],
				//产品系列表
				productSeries: [],
                productSeriesList: [],
				//产品系列下拉框获取loading
                seriesSelLoading:false,
                //产品名称下拉框获取loading
                proNameLoading:false,
                /**
                 * 过滤条件
                 */
                selFilters: {
                    tSeriesId: '',
                    proNameId: '',
                    proModel: '',
                },
            }
		},
		methods: {
		    /**
			 * 过滤产品名称列表
			 */
		    proNameFilters(id){
		        let vm = this
				let data = []
				data = vm.productName.filter((item)=>{
				    if(item.id === id){
				        return item
					}
				})
                console.log("proNameFilters:::::"+JSON.stringify(data))
			},
            /**
             * 获取产品系列表数据接口
             */
            getProductSeries(){
                let vm = this
                vm.productSeriesList = Object.assign([],[])
                vm.productNameList = Object.assign([],[])
				vm.selFilters.proNameId =  ''
                vm.filters.proNameId =  ''
                let params = {}
                vm.seriesLoading = true;
                post(instanceUrl.getProductSeries,params).then((res) => {
                    vm.seriesLoading = false;
                    if("success" === res.status) {
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
                    tSeriesId: vm.filters.tSeriesId
				}
                post(instanceUrl.getProductName,params).then((res) => {
                    if("success" === res.status) {
                        vm.productName = Object.assign([],res.data)
                        let data = []
                        data.push({
                            id: '',
                            proName: '全部'
                        });
                        res.data.forEach((item)=>{
                            data.push(item)
                        })
                        vm.productNameList = Object.assign([],data)
                        this.proNameFilters("2")
                        return
                    }
                    vm.$message({
                        message: res.msg,
                        type: 'error'
                    })
                }).catch((error) => {
                    vm.listLoading = false;
                    console.log("报错了")
                })
            },
            /**
             * 获取产品系列表数据接口
             */
            getProduct(){
                let vm = this
                let params = {
                    tSeriesId: vm .filters.tSeriesId==='*'?"":vm .filters.tSeriesId,
                    proNameId: vm .filters.proNameId==='*'?"":vm .filters.proNameId,
                    proModel: vm .filters.proModel,
				}
                vm.listLoading = true;
                post(instanceUrl.getProduct,params).then((res) => {
                    vm.listLoading = false;
                    if("success" === res.status) {
                        vm.total = res.data.length;
                        vm.product = res.data;
                        vm.productList = res.data.filter((u, index) => index < vm.size * vm.page && index >= vm.size * (vm.page - 1));
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
             * 产品系列转换
             */
            formatSeries: function (row, column) {
                let vm = this
                let name = ''
                vm.productSeries.forEach((item)=>{
                    if(item.id === row.tSeriesId){
                        name =  item.series
                    }
                })
                return ''===name?row.tSeriesId:name
            },
			/**
			 * 产品名称转换转换
			 */
            formatName: function (row, column) {
                let vm = this
                let name = ''
                vm.productName.forEach((item)=>{
                    if(item.id === row.proNameId){
                        name =  item.proName
					}
				})
                return ''===name?row.proNameId:name
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
                vm.productList =  vm.product.filter((u, index) => index < vm.size * vm.page && index >= vm.size * (vm.page - 1));
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
                vm.addForm = Object.assign({}, {
                    id: '',
                    proNameId: '',
                    proModel: '',
                    voltageRange: '',
                    distributionPrice: '',
                    retailPrice: '',
                    proDesc: '',
                    policy: '',
                    policyReplace: '',
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
                            post(instanceUrl.productUpdate,params).then((res) => {
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
                                    vm.getProduct();
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
							let params = Object.assign({}, vm.addForm);
                            vm.addLoading = true;
                            post(instanceUrl.productInsert,params).then((res) => {
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
                                    vm.getProduct();
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

            this.getProductName()
		    this.getProductSeries()
            this.getProduct()

        }
	}

</script>

<style scoped>

</style>