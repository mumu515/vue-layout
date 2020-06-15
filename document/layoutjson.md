#layout 节点

e.g. 
```
{
	nodeType: "el-breadcrumb",
	props: {"separator-class": "el-icon-arrow-right"},
	children: [
		{
			nodeType: "el-breadcrumb-item",
			props: {to: {path: "/index"}},
			innerHTML:"首页"
		}
	]
}

```
##节点属性

|属性名称|类型|默认|可选值|
|-----|---|---|----|
|nodeType|string|--|--|
|props|object|--|--|
|innerHTML|string|--|--|
|style|object|||
|class|string|||
|scope|object|||
|slot|string|||
|attrs|object|||
|on|array|||
|v-if|string|||
|scopedSlots|array|||
|scopeMapping|array|||
|defaultValueMap|array|||
|children|array|||

- nodeType:<br>
  - 容器类.<br> 
    本身包含预定义的布局定义,可以通过设定指定的props影响子节点的布局方式.
    - el-container
    - el-header
    - el-footer
    - el-row
    - el-col
    - el-aside
    - el-main
    - el-card
  - form相关.<br>
    主要用于与界面交互的表单中.
    - y-input(不能直接使用element原生el-input)
    - y-select(不能直接使用element原生el-select)
    - y-input-number
    - y-date-picker
    - el-form
    - el-form-item
  - 数据类
    - el-table
    - el-table-column
    - el-pagination
  - navigation
    - el-breadcrumb
    - el-breadcrumb-item
    - el-dropdown

- innerHTML<br>
  该节点直接展示内容,  
  e.g.  
  {nodeType:"span",innerHTML:"展示内容"}  
  解析成html会成为:`<span>展示内容</span>`
- style<br>
  该节点行内样式  
  e.g.  
  {nodeType:"span",style:{margin:"10px"}}  
  解析成html会成为:`<span style="margin:10px;"></span>`
- class<br>
  直接解析为该节点class,如果要设置多个class,需要以空格分割.
- scope
  节点绑定的数据以及方法,该节点及其子节点自动继承均可使用
- slot
  向父节点指定slot位置传入本节点,使用时要求父节点设有同名slot.  
  e.g.  
  ```
  {
    nodeType: "el-form-item",
    style: {margin: 0},
    children: [
      {
        nodeType: "span",
        innerHTML: "显示姓名",
        slot: "label",// el-form-item预设了名为label的slot,此处表示在该slot处显示一个span
        style: {color: "#999999"}
      }
    ]
  }
  ```
- attrs<br>
  设置本节点一些html标签属性,如id,可以用去在其他节点使用时方便全局查找本节点
- children
  子节点组
- on<br>
  本节点的一些绑定事件,在触发相应事件时允许执行相关语句或者回调scope中的相应方法处理.  
  e.g.
  ```
  {
  	nodeType: "i",
  	class: "el-icon-plus",
  	style: {margin: "0 20px"},
  	on: [
  		{
  			name: "click",
  			handler: {body: "{familyPersonData.addresses.push({addressCHN:{},locale:[locale.CHN.instanceId]})}"}
  		}]
  }
  ```
- v-if<br>
  是否显示本节点
- scopedSlots/scopeMapping<br>
  二者搭配使用.,由于动态定义和提取节点的子scope
  ``` 
  
  {
  	nodeType: "el-table-column",
  	props: {label: "关系"},
  	scopedSlots: [
  		{
  			name: "default",
  			scopeMapping: {
  				row: "row",
  				index: "$index"// 将slot中的$index赋值到本层scope的index变量上
  			},
  			nodes: [
  				{
  					nodeType: "y-select",
  					props: {
  						"v-model": "{row.relationship}",
  						filter: {params: {asOfDate: "{asOfDate}"}},
  						optionsPath: "FAMILY_DEPENDENT.relationship"
  					}
  				}]
  		}]
  }
  ```
  目前使用scopedSlots的节点类型：
    
  |节点类型|scopedSlots名称|scopedSlots变量|
  |---|---|---|
  |el-table-column|default|row, column, $index|
  |el-table-column|header|column, $index|
  |y-list|header|index, item, list|
  

    
  
