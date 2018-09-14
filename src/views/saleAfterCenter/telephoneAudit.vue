<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<!--<el-form-item label="昵称：">-->
					<!--<el-input v-model="filters.nickName" placeholder="昵称"></el-input>-->
				<!--</el-form-item>-->
				<!--<el-form-item label="账号：">-->
					<!--<el-input v-model="filters.account" placeholder="账号"></el-input>-->
				<!--</el-form-item>-->
				<el-form-item>
					<el-button type="primary" v-on:click="serch">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="dataList" highlight-current-row v-loading="listLoading" style="width: 100%;height:100%;">
			<el-table-column prop="series" label="产品系列" width="200" sortable>
			</el-table-column>
			<el-table-column prop="proName" label="产品名称" width="200" sortable>
			</el-table-column>
			<el-table-column prop="proModel" label="产品型号" min-width="200" sortable>
			</el-table-column>
			<el-table-column prop="proDesc" label="产品说明" width="300" sortable>
			</el-table-column>
			<el-table-column prop="barCode" label="产品流水号" min-width="200" sortable>
			</el-table-column>
			<el-table-column prop="cusName" label="客户姓名" min-width="120" sortable>
			</el-table-column>
			<el-table-column prop="cusTelphone" label="客户手机号" width="120" sortable>
			</el-table-column>
			<el-table-column prop="faultPoint" label="损坏点" min-width="200" sortable>
			</el-table-column>
			<el-table-column prop="applyStatus" label="售后状态" min-width="120" sortable>
			</el-table-column>
			<el-table-column prop="isDel" label="是否禁用" min-width="120" sortable
							 :formatter="formatDel">
			</el-table-column>
			<el-table-column label="操作" width="100">
				<template slot-scope="scope">
					<el-button size="small" v-if="'first_trial'===scope.row.applyStatus" @click="handleEdit(scope.$index, scope.row)">审核</el-button>
					<el-button size="small" v-if="'the_trial_pass'===scope.row.applyStatus" @click="reminder(scope.$index, scope.row)">催单</el-button>
					<el-button size="small" v-if="'the_trial_reject'===scope.row.applyStatus" @click="rejectReminder(scope.$index, scope.row)">通知</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="size" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--审核界面-->
		<el-dialog title="审核" :close-on-click-modal="false"
				   :visible.sync="addFormVisible">
			<el-form :model="addForm" label-width="120px" :rules="addForm.isPay==='N'?addFormRules:addFromPayRules" ref="addForm">
				<el-form-item label="客户名称" prop="cusName">
					<el-input v-model="addForm.cusName" auto-complete="off" disabled/>
				</el-form-item>
				<el-form-item label="客户手机号" prop="cusTelphone">
					<el-input v-model="addForm.cusTelphone" auto-complete="off" disabled/>
				</el-form-item>
				<el-form-item label="产品系列" prop="series">
					<el-input v-model="addForm.series" auto-complete="off" disabled/>
				</el-form-item>
				<el-form-item label="产品名称" prop="proName">
					<el-input v-model="addForm.proName" auto-complete="off" disabled/>
				</el-form-item>
				<el-form-item label="产品型号" prop="proModel">
					<el-input v-model="addForm.proModel" auto-complete="off" disabled/>
				</el-form-item>
				<el-form-item label="故障图" prop="cusName">
					<template v-for="url in addForm.file">
						<img :src="url" alt="" class="img" @click="openImage(url)">
					</template>
				</el-form-item>
				<el-form-item label="回访内容" prop="applyDesc">
					<el-input type="textarea" v-model="addForm.applyDesc" auto-complete="off" />
				</el-form-item>
				<el-form-item label="是否额外付费" prop="isPay">
					<el-radio-group v-model="addForm.isPay">
						<el-radio class="radio" label="N">否</el-radio>
						<el-radio class="radio" label="Y">是</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="付费记录" prop="payGoods" v-if="addForm.isPay==='Y'">
					<el-input type="textarea" v-model="addForm.payGoods" auto-complete="off" />
				</el-form-item>
				<el-form-item label="是否直寄配件" prop="isMailingAccessories">
					<el-radio-group v-model="addForm.isMailingAccessories">
						<el-radio class="radio" label="N">否</el-radio>
						<el-radio class="radio" label="Y">是</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
				<el-button type="danger" @click.native="openRejectSubmit" :loading="addLoading">拒绝</el-button>
			</div>
		</el-dialog>

		<!--拒绝界面-->
		<el-dialog title="审核" :close-on-click-modal="false"
				   :visible.sync="rejectFormVisible">
			<el-form :model="rejectForm" label-width="120px" :rules="rejectFormPayRules" ref="rejectForm">
				<el-form-item label="回访内容" prop="applyRejectResion">
					<el-input type="textarea" v-model="rejectForm.applyRejectResion" auto-complete="off" />
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="rejectFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="rejectSubmit" :loading="rejectLoading">提交</el-button>
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
				 * 拒绝弹窗相关
				 */
                rejectFormVisible:false,
                rejectLoading:false,
                rejectForm:{
                    productSaleApplyId: '',
                    applyRejectResion:'',
                },
                rejectFormPayRules: {
                    applyRejectResion: [
                        { required: true, message: '请输入拒绝原因', trigger: 'blur' }
                    ],
                },
                /**
                 * 过滤条件
                 */
                filters: {
                    nickName: '',
                    account: ''
                },
                data: [],
                /**
                 * 分页之后的数据展示
                 */
                dataList:[],
                total: 0,
                page: 1,
                size:utils.size,
                listLoading: false,
                addFormVisible: false,//新增界面是否显示
                //新增界面数据
                addForm: {
                    productSaleApplyId: '',
                    cusName:'',
                    cusTelphone:'',
                    file:'',
                    series:'',
                    proName:'',
                    proModel:'',
                    applyDesc:'',
                    payGoods: '',
                    isPay: "N",
                    isMailingAccessories: "N",
                },
                addFormRules: {
                    applyDesc: [
                        { required: true, message: '请输入回访内容', trigger: 'blur' }
                    ],
                },
                addFromPayRules:{
                    applyDesc: [
                        { required: true, message: '请输入回访内容', trigger: 'blur' }
                    ],
                    payGoods: [
                        { required: true, message: '请输入付费内容', trigger: 'blur' }
                    ],
				},
                addLoading: false,
            }
        },
        mounted() {
            this.serch();
        },
        methods: {
            //电话审核-拒绝
            rejectSubmit(){
                let vm = this
                vm.$refs.rejectForm.validate((valid) => {
                    if (valid) {
                        vm.$confirm('确认提交吗？', '提示', {}).then(() => {
                            //NProgress.start();
                            let params = Object.assign({}, vm.rejectForm);
                            vm.rejectLoading = true;
                            post(instanceUrl.telephoneAuditReject,params).then((res) => {
                                vm.rejectLoading = false;
                                //NProgress.done();
                                vm.$refs['rejectForm'].resetFields();
                                if("success" === res.status){
                                    //关闭新增窗口
                                    vm.rejectFormVisible = false;
                                    vm.addFormVisible = false;
                                    vm.$message({
                                        message: '拒绝提交成功',
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
                                vm.rejectLoading = false
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
                            post(instanceUrl.telephoneAudit,params).then((res) => {
                                vm.addLoading = false;
                                //NProgress.done();
                                vm.$refs['addForm'].resetFields();
                                if("success" === res.status){
                                    //关闭新增窗口
                                    vm.addFormVisible = false;
                                    vm.$message({
                                        message: '审核成功',
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
            },
            /**
			 * 新窗口打开图片
			 */
            openImage(url){
                window.open(url);
			},
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
                vm.serchList =  vm.serch.filter((u, index) => index < vm.size * vm.page && index >= vm.size * (vm.page - 1));
            },
            //获取用户列表
            serch() {
                let vm = this
                let params = {
                    // applyStatus: "first_trial"
                }
                vm.listLoading = true;
                post(instanceUrl.getTelephoneAudit,params).then((res) => {
                    vm.listLoading = false;
                    if("success" == res.status){
                        vm.total = res.data.length;
                        vm.data = res.data;
                        vm.dataList = res.data.filter((u, index) => index < vm.size * vm.page && index >= vm.size * (vm.page - 1));
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
			 * 电话催单
             * @param index
             * @param row
             */
            reminder(index, row) {
                let vm = this
                vm.$confirm('客户姓名：'+row.cusName+',电话：'+row.cusTelphone+'，请拨打电话进行催单！', '提示', {}).then(() => {

                });
            },
            /**
             * 拒绝售后申请通知
             * @param index
             * @param row
             */
            rejectReminder(index, row) {
                let vm = this
                vm.$confirm('客户姓名：'+row.cusName+',电话：'+row.cusTelphone+'，请拨打电话进行通知！', '提示', {}).then(() => {

                });
            },
			//电话审核拒绝弹窗
            openRejectSubmit(){
                let vm = this
                vm.rejectFormVisible = true;
                vm.rejectForm = Object.assign({}, {
                    productSaleApplyId: vm.addForm.productSaleApplyId,
                    applyRejectResion:'',
                });
			},
            //电话审核
            handleEdit: function (index, row) {
                let vm = this
                vm.addFormVisible = true;
                vm.addForm = Object.assign({}, {
                    productSaleApplyId: row.id,
                    cusName:row.cusName,
                    cusTelphone:row.cusTelphone,
                    file:row.file,
                    series:row.series,
                    proName:row.proName,
                    proModel:row.proModel,
                    applyDesc:'',
                    payGoods: '',
                    isPay: "N",
                    isMailingAccessories: "N",
                });

            },
        }
    }

</script>

<style scoped>
	.img{
		width: 200px;
		height: 200px;
	}
</style>