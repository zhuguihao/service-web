let instanceUrl = {
    /**
     * 获取数据字典
     */
    getDictUrl: "/serviceCenter/getDict",
    /**
     * 修改数据字典表
     */
    editDict: "/serviceCenter/editDict",
    /**
     * 添加数据字典表
     */
    addDict: "/serviceCenter/addDict",
    /**
     * 添加数据字典表
     */
    getDictList: "/dict/getDictList",
    /**
     * 查询用户表信息
     */
    getUser: "/serviceCenter/getUser",
    /**
     * 修改用户表
     */
    editUser: "/serviceCenter/editUser",
    /**
     * 查询菜单表信息
     */
    getMenu: "/serviceCenter/getMenu",
    /**
     * 查询角色菜单表关联信息
     */
    getGroupMenu: "/menu/getGroupMenu",
    /**
     * 修改菜单表
     */
    editMenu: "/menu/editMenu",
    /**
     * 添加菜单表
     */
    addMenu: "/menu/addMenu",
    /**
     * 查询角色表
     */
    getGroup: "/serviceCenter/getGroup",
    /**
     * 新增角色表--添加子节点数据
     */
    addGroup: "/group/addGroupChildren",
    /**
     * 修改角色表
     */
    editGroup: "/group/editGroup",
    /**
     * 角色关联菜单表
     */
    relationMenu: "/group/relationMenu",
    /**
     * 角色关联用户表
     */
    relationUser: "/group/relationUser",
    /**
     * 登录接口
     */
    login: "/login/login",
    /**
     * 查询角色关联人员信息
     */
    getGroupUser: "/login/getGroupUser",
    /**
     * 查询产品系列表信息
     */
    getProductSeries: "/pcProduct/getProductSeries",
    /**
     * 新增产品系列表信息
     */
    pcProductInsert: "/pcProduct/pcProductInsert",
    /**
     * 查询产品系列表信息
     */
    pcProductUpdate: "/pcProduct/pcProductUpdate",
    /**
     * 查询产品名称表信息
     */
    getProductName: "/pcProduct/getProductName",
    /**
     * 修改产品名称表信息
     */
    productNameUpdate: "/pcProduct/productNameUpdate",
    /**
     * 新增产品名称表信息
     */
    productNameInsert: "/pcProduct/productNameInsert",
    /**
     * 查询产品表信息
     */
    getProduct: "/pcProduct/getProduct",
    /**
     * 新增产品表信息
     */
    productInsert: "/pcProduct/productInsert",
    /**
     * 新增产品表信息
     */
    productUpdate: "/pcProduct/productUpdate",
    /**
     * 查询电话审核数据
     */
    getTelephoneAudit:"/saleAfter/getTelephoneAudit",
    /**
     * 初步电话审核
     * 201800904
     */
    telephoneAudit:"/saleAfter/telephoneAudit",
    /**
     * 初步电话审核-拒绝
     * 201800904
     */
    telephoneAuditReject:"/saleAfter/telephoneAuditReject",
    /**
     * 查询快递运单信息
     * 201800905
     */
    getExpressDelivery:"/saleAfter/getExpressDelivery",
    /**
     * 签收客户快递
     * 201800905
     */
    signExpress:"/saleAfter/signExpress"
}
export default instanceUrl;