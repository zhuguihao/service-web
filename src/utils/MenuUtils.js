import lazyLoading from './lazyLoading'
export default (routers,data) => {
    //这里之所以要重新遍历一下，是因为，通常我们动态路由的时候，是获取服务端数据，这个component属性是一个字符串，或者可能连字段名都是其他的key
    //所以这里要做一些转换
    //修改第一层的title为Home页路由，其余的头部为None(中转路由)页面
    data.forEach((item)=>{
        let menu = Object.assign({},item)
        menu.component = !menu.menuParams || item.isTitle=='Y' ? lazyLoading('Home'):lazyLoading(menu.menuParams)
        menu.path = menu.menuUrl
        menu.name = menu.menuName
        if(!item.leaf){
            menu.children = []
        }
        let data = []
        generaMenu(data,item.children)
        pushRouters(menu.children,data)
        routers.push(menu)
    })
    console.log("routers:"+JSON.stringify(routers))
}

function pushRouters(routers,data) {
    data.forEach((item)=>{
        routers.push(item)
    })
}

function generaMenu(children,data){
    data.forEach((item)=>{
        let menu = Object.assign({},item)
        menu.component = !menu.menuParams || item.isTitle=='Y' ? lazyLoading('None'):lazyLoading(menu.menuParams)
        menu.path = menu.menuUrl
        menu.name = menu.menuName
        if(!item.leaf){
            menu.children = []
            if(item.children)generaMenu(menu.children,item.children)
        }
        children.push(menu)
    })
}