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
						<el-button type="primary" v-on:click="filterSerch">查询</el-button>
					</el-form-item>
					<!--<el-form-item v-show="groupList.length===0">-->
					<!--<el-button type="primary" @click="handleAdd">新增</el-button>-->
					<!--</el-form-item>-->
				</el-form>
			</el-col>
		</div>

		<div style="float: left;width: 100%;">

			<el-tree :data="groupList"
					 node-key="id"
					 :props="props"
					 default-expand-all
					 :filter-node-method="filterNode"
					 ref="greoupTree">
			  <span class="custom-tree-node" slot-scope="{ node, data }">
				<span>{{ data.groupName }}</span>
				<span>
					<el-button class="btnDel" type="text" size="mini" icon="el-icon-delete" @click.stop="() => removeGroup(data)" v-show="data.children && data.children.length ===0">
						删除
					</el-button>
				  <el-button class="btnAdd" type="text" size="mini" icon="el-icon-plus" @click.stop="() => handleAddChildren(data)">
					新增
				  </el-button>
					<el-button class="btnEdit" type="text" size="mini" icon="el-icon-edit" @click.stop="() => handleEdit(data)">
					编辑
				  </el-button>
					<!--v-show="util.getUserInfo().groupId != data.id"-->
					<el-button type="text" size="mini" icon="el-icon-menu" @click.stop="() => configureGroup(data)" >
					配置角色菜单
				  </el-button>
					<el-button type="text" size="mini" icon="el-icon-menu" @click.stop="() => configurePeople(data)" >
					配置角色人员
				  </el-button>
				</span>
			  </span>
			</el-tree>

		</div>

		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="角色代码" prop="groupCode">
					<el-input v-model="editForm.groupCode" auto-complete="off" disabled/>
				</el-form-item>
				<el-form-item label="角色名称" prop="groupName">
					<el-input v-model="editForm.groupName" auto-complete="off" />
				</el-form-item>
				<!--<el-form-item label="是否禁用">-->
				<!--<el-radio-group v-model="editForm.isDel">-->
				<!--<el-radio class="radio" label="N">否</el-radio>-->
				<!--<el-radio class="radio" label="Y">是</el-radio>-->
				<!--</el-radio-group>-->
				<!--</el-form-item>-->
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
					<el-input v-model="addForm.groupCode" auto-complete="off" />
				</el-form-item>
				<el-form-item label="角色名称" prop="groupName">
					<el-input v-model="addForm.groupName" auto-complete="off" />
				</el-form-item>
				<!--<el-form-item label="是否禁用">-->
				<!--<el-radio-group v-model="addForm.isDel">-->
				<!--<el-radio class="radio" label="N">否</el-radio>-->
				<!--<el-radio class="radio" label="Y">是</el-radio>-->
				<!--</el-radio-group>-->
				<!--</el-form-item>-->
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--配置角色菜单界面-->
		<el-dialog title="配置角色菜单" :visible.sync="configureVisible":close-on-click-modal="false">
			<el-form :inline="true">
				<el-form-item label="菜单类型：">
					<el-select v-model="menuType" placeholder="请选择菜单类型"
							   @change="selectChange">
						<el-option
								v-for="item in typeList"
								:key="item.code"
								:label="item.value"
								:value="item.code">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<el-tree :data="menu"
					 node-key="id"
					 :props="menuProps"
					 default-expand-all
					 show-checkbox
					 ref="menuTree">

				<!--check-strictly-->
				<span class="custom-tree-node" slot-scope="{ node, data }">
				<span>{{ data.menuName }}</span>
			  </span>
			</el-tree>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="configureVisible = false">取消</el-button>
				<el-button type="primary" @click.native="configureSubmit" :loading="configureLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--配置角色菜单界面-->
		<el-dialog title="配置角色人员" :visible.sync="configurePeoVisible":close-on-click-modal="false">
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true" :model="userFilter">
					<el-form-item>
						<el-input v-model="userFilter.userName" placeholder="姓名"></el-input>
					</el-form-item>
					<el-form-item>
						<el-input v-model="userFilter.userAccount" placeholder="账号"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" v-on:click="getGroupUser">查询</el-button>
					</el-form-item>
				</el-form>
			</el-col>
			<el-table
					:data="userList"
					highlight-current-row
					v-loading="userListLoading"
					ref="userTable"
					tooltip-effect="dark"
					height="400"
					border
					row-key="id"
					@selection-change="handleSelectionChange"
					style="width: 100%;height:100%;">
				<el-table-column

						type="selection"
						reserve-selection
						width="55"></el-table-column>
				<el-table-column prop="nickName" label="昵称" width="100" sortable>
				</el-table-column>
				<el-table-column prop="account" label="账号" width="150" sortable>
				</el-table-column>
				<el-table-column prop="phone" label="手机号" min-width="120" sortable>
				</el-table-column>
			</el-table>
			<!--工具条-->
			<el-col :span="24" class="toolbar">
				<el-pagination layout="prev, pager, next" @current-change="handleUserCurrentChange" :page-size="userSize" :total="userTotal" style="float:right;">
				</el-pagination>
			</el-col>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="configurePeoVisible = false">取消</el-button>
				<el-button type="primary" @click.native="configurePeoSubmit" :loading="configurePeoLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
    import post from '../../api/axiosApi'
    import instanceUrl from '../../api/interfaceName'
    import utils from '../../api/variable'
    import util from '@/api/util'

    export default {
        data() {
            return {
                //配置角色人员
                configurePeoVisible: false,
                //配置角色人员loading
                configurePeoLoading: false,
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
                    parentId: '',
                    groupCode: '',
                    groupName: '',
                    isDel: 'N',
                },
                //菜单类型
                typeList:[],
                //菜单转换值
                props:{
                    label: 'groupName'
                },
                menuProps:{
                    label: 'menuName'
                },
                //菜单类型集合
                typeSelList:[],
                //角色菜单开关
                configureVisible:false,
                //角色菜单配置提交loading
                configureLoading:false,
                //角色菜单列表
                groupMenu:{},
                //菜单类型绑定
                menuType:"",
                //菜单列表
                menu:[],
                //选择的菜单列表
                menuTreeCheckedKeys: [],
                //选中的角色ID
                roleId: "",
                //查询不是头部的菜单
                isTitle:'N',
                //初始化缓存类
                util:util,
                //用户列表
				user:[],
                userList:[],
                //用户列表Loading
                userListLoading: false,
                //用户列表下标尺寸
                userSize:utils.size,
                userPage: 1,
                userTotal:0,
                userSelection:[],
				//用户名字过滤
                userFilter:{
                    userName:"",
                    userAccount:""
				},
                userListLoading:false,
            }
        },
        methods: {
            //配置角色人员选中的事件
            handleSelectionChange(val) {
				let vm = this
				vm.userSelection = val
            },
            /**
             * 过滤查询条件
             */
            filterSerch() {
                this.$refs.greoupTree.filter(this.filters)
            },
            /**
             * 过滤树形结构数据
             */
            filterNode(value, data) {
                if (!value) return true;
                return data.groupCode.indexOf(value.groupCode) !== -1 && data.groupName.indexOf(value.groupName) !== -1;
            },
            //查询菜单数据
            getMenuList(){
                let vm = this
                let params = {
                    roleId: vm.roleId,
                    type: vm.menuType,
                    isTitle:vm.isTitle,
                };
                vm.listLoading = true;
                post(instanceUrl.getGroupMenu,params).then((res) => {
                    vm.listLoading = false;
                    if("success" === res.status){
                        vm.menu = res.data.menuList;
                        let checked = Object.assign([],res.data.checked);
                        vm.setMenuTreeCheckedKeys(checked)
                        // vm.menuList = res.data.filter((u, index) => index < vm.size * vm.page && index >= vm.size * (vm.page - 1));
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
             * 设置已选中的菜单栏
             */
            setMenuTreeCheckedKeys(data){
                this.$refs.menuTree.setCheckedKeys(data);
            },
            selectChange(){

                this.menu = []
                this.getMenuList()
            },
            handleNodeClick(data) {
                console.log(data);
            },
            /**
             * 是否禁用转换
             */
            formatDel: function (row, column) {
                return row.isDel == 'N' ? '否' : row.isDel == 'Y' ? '是' : '未知';
            },
            handleUserCurrentChange(val) {
                let vm = this
                vm.userPage = val;
                vm.userList =  vm.user.filter((u, index) => index < vm.userSize * vm.userPage && index >= vm.userSize * (vm.userPage - 1));
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
                        vm.typeList = Object.assign([],res.data)
                        vm.menuType = res.data.length>0?res.data[0].code:""
                        vm.getMenuList()
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
                    if("success" === res.status){
                        vm.total = res.data.length;
                        vm.group = res.data;
                        vm.groupList = res.data.filter((u, index) => index < vm.size * vm.page && index >= vm.size * (vm.page - 1));
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
            //显示配置角色人员
            configurePeople(data){
                let vm = this
                vm.roleId = ""
                vm.configurePeoVisible=true
                vm.roleId = data.id
                if(vm.user.length>0)vm.$refs.userTable.clearSelection();
                vm.getGroupUser()
            },
            //显示配置角色菜单
            configureGroup(data){
                let vm = this
                vm.roleId = ""
                vm.typeList = []
                vm.menu = []
                vm.configureVisible=true
                vm.groupMenu = Object.assign({}, data);
                vm.roleId = data.id

                vm.getDictType()
            },
            //显示编辑界面
            handleEdit: function (data) {
                this.editFormVisible = true;
                this.editLoading = false;
                this.editForm = Object.assign({}, data);
            },
            //显示子节点新增界面
            handleAddChildren: function (row) {
                this.addFormVisible = true;
                this.addForm = {
                    id: '',
                    parentId: row.id,
                    groupCode: '',
                    groupName: '',
                    isDel: 'N',
                };
            },
            //删除子节点
            removeGroup(data){
                let vm = this
                vm.$confirm('确认删除该节点吗吗？', '提示', {}).then(() => {
                    let params = {
                        id:data.id,
                        isDel:"Y"
                    };
                    vm.editLoading = true;
                    post(instanceUrl.editGroup,params).then((res) => {
                        vm.editLoading = false;
                        if("success" === res.status){
                            vm.$message({
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
                    });
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
                            post(instanceUrl.editGroup,params).then((res) => {
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
            /**
			 * 从后台获取的选中人员名单赋值给当前列表
             * @param data
             * @param checkData
             * @param boolean
             */
			userToggleRowSelection(data,checkData,boolean){
                checkData.forEach((id) =>{
                    data.forEach((item) => {
                        if(id == item.id){
                            this.$refs.userTable.toggleRowSelection(item,boolean)
                        }
                    })
				})
			},
            //配置角色人员
            configurePeoSubmit(){
                let vm = this
				// let data = ["5186294f490b480aaf35df135fea2185","b750934010b44b928e9908c24bde5b3f","692f38cb423e481b90d40d0502394bf6"]
                // vm.userToggleRowSelection(vm.user,data,true)
                // this.$refs.userTable.toggleAllSelection();
                // return
				/**
				 * 获取选中人员ID名单
				 */
				let data = []
                vm.userSelection.forEach(item=>{
					data.push(item.id)
				})
				console.log(JSON.stringify(data))

                let params = {
                    ids: data,
                    roleId:vm.roleId
                };
                vm.userListLoading = true;
                vm.configurePeoLoading = true
                post(instanceUrl.relationUser,params).then((res) => {
                    vm.userListLoading = false;
                    vm.configurePeoLoading = false;
                    if("success" === res.status) {
                        vm.configurePeoVisible = false
                        vm.$message({
                            message: res.msg,
                            type: 'success'
                        });

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
             * 从已选的菜单节点中去除父级节点ID
             */
            delParentId(ids){
                let vm = this
                let isNoTileIds = ids.filter((id)=>{
                    vm.menu.forEach((item)=>{
                        if(id === item.id){
                            return id
                        }
                    })
                })
                console.log("isNoTileIds::::"+JSON.stringify(isNoTileIds))
            },
            //配置角色菜单
            configureSubmit(){
                let vm = this
                /**
                 * 组装父节点及子节点
                 */
                let ids = Object.assign([],vm.$refs.menuTree.getCheckedKeys())
                // ids = ids.concat(vm.$refs.menuTree.getHalfCheckedKeys())
                // vm.delParentId(ids)
                let params = {
                    type:vm.menuType,
                    ids: ids,
                    roleId:vm.roleId
                };
                vm.listLoading = true;
                vm.configureLoading = true
                post(instanceUrl.relationMenu,params).then((res) => {
                    vm.listLoading = false;
                    vm.configureLoading = false;
                    if("success" === res.status) {
                        vm.configureVisible=false
                        vm.$message({
                            message: res.msg,
                            type: 'success'
                        });
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
            //新增
            addSubmit: function () {
                let vm = this
                vm.$refs.addForm.validate((valid) => {
                    if (valid) {
                        vm.$confirm('确认提交吗？', '提示', {}).then(() => {
                            //NProgress.start();
                            let params = Object.assign({}, vm.addForm);
                            vm.addLoading = true;
                            post(instanceUrl.addGroup,params).then((res) => {
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
                                    message: '新增异常',
                                    type: 'error'
                                });

                            }).catch((error) => {
                                console.log("报错了")
                            })
                        });
                    }
                });
            },
            //获取用户列表
            getGroupUser() {
                let vm = this
                let params = {
                    nickName: vm.userFilter.userName,
                    account: vm.userFilter.userAccount,
                    roleId: vm.roleId
				};
                vm.userListLoading = true
                post(instanceUrl.getGroupUser,params).then((res) => {
                    vm.userListLoading = false
                    if("success" == res.status){
                        let userList = Object.assign([],res.data.userList)
                        let checkedList = Object.assign([],res.data.checkedList)
                        vm.userToggleRowSelection(userList,checkedList,true)
                        vm.userTotal = userList.length
                        vm.user = userList
                        vm.userList = vm.user.filter((u, index) => index < vm.size * vm.userPage && index >= vm.userSize * (vm.userPage - 1))
                        return
                    }
                    vm.$message({
                        message: res.msg,
                        type: 'error'
                    });
                }).catch((error) => {
                    vm.userListLoading = false
                    console.log("报错了")
                })
            },
        },
        mounted() {
            this.serch();
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