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
			<el-table-column prop="cusName" label="客户姓名" min-width="200" sortable>
			</el-table-column>
			<el-table-column prop="cusTelphone" label="客户手机号" width="120" sortable>
			</el-table-column>
			<el-table-column prop="series" label="产品系列" width="200" sortable>
			</el-table-column>
			<el-table-column prop="proName" label="产品名称" width="200" sortable>
			</el-table-column>
			<el-table-column prop="proModel" label="产品型号" min-width="200" sortable>
			</el-table-column>
			<el-table-column prop="waybillNumber" label="运单号" width="300" sortable>
			</el-table-column>
			<el-table-column prop="address" label="联系地址" min-width="200" sortable>
			</el-table-column>
			<el-table-column prop="addressee" label="寄件人信息" min-width="120" sortable>
			</el-table-column>
			<el-table-column prop="addressPhone" label="寄件人手机号" min-width="150" sortable>
			</el-table-column>
			<el-table-column prop="isMailingAccessories" label="是否为直寄配件" min-width="150" sortable
							 :formatter="formatDel">
			</el-table-column>
			<el-table-column prop="applyStatus" label="售后状态" min-width="120" sortable>
			</el-table-column>
			<el-table-column prop="isDel" label="是否禁用" min-width="120" sortable
							 :formatter="formatDel">
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<el-button size="small" v-if="'courier_tracking'===scope.row.applyStatus" @click="signAndExpress(scope.$index, scope.row)">签收</el-button>
					<el-button size="small" v-if="'courier_tracking_reject'===scope.row.applyStatus" @click="reminder(scope.$index, scope.row)">通知客户被拒</el-button>
					<el-button size="small" v-if="'company_courier_tracking'===scope.row.applyStatus" @click="reminderCustomer(scope.$index, scope.row)">通知客户签收</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="size" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--新增界面-->
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
                    id: '',
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
                post(instanceUrl.getExpressDelivery,params).then((res) => {
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
             * 通知客户进行签收公司快递
             * @param index
             * @param row
             */
            reminderCustomer(index, row) {
                let vm = this
                vm.$confirm('客户姓名：'+row.cusName+',电话：'+row.cusTelphone+'，请拨打电话进行通知签收公司快递！', '提示', {}).then(() => {

                });
            },
            /**
			 * 通知客户快递信息被驳回需电话提醒快递信息
             * @param index
             * @param row
             */
            reminder(index, row) {
                let vm = this
                vm.$confirm('客户姓名：'+row.cusName+',电话：'+row.cusTelphone+'，请拨打电话进行通知客户快递信息被驳回！', '提示', {}).then(() => {

                });
            },
			//签收快递
            signAndExpress(index, row){
                let vm = this
                vm.$confirm('客户姓名：'+row.cusName+',电话：'+row.cusTelphone+'，请确认该快递已经签收！', '提示', {}).then(() => {
                    let params = {
                        productSaleApplyId:row.id,
						//签收的产品列表
                        partsList:''
					}
                    vm.listLoading = true;
                    post(instanceUrl.signExpress,params).then((res) => {
                        vm.listLoading = false;
                        if("success" === res.status){
                            //关闭修改窗
                            vm.editFormVisible = false;
                            vm.$message({
                                message: '签收客户快递成功',
                                type: 'success'
                            });
                            vm.serch();
                        }else{
                            vm.$message({
                                message: '修改异常',
                                type: 'error'
                            });
                        }
                    }).catch((error) => {
                        vm.listLoading = false;
                        vm.$message({
                            message: '网络异常',
                            type: 'error'
                        });
                    })
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