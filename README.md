### wechat-city-picker

> 微信小程序原生省市区三级联动插件

建议搭配从下到上划出的`popup`组件一起使用

#### 传递参数

|名称|类型|必传|默认值|单位|说明
|:----|:----|:----|:----|:----|:----|
|value|Array|是|北京市北京市东城区| - |传入数组为省、市、区code，或者为空数组|
|color|String|否|#5fbf55| - |确定按钮颜色|
|height|Number / String|否|600|rpx|滑动选择器的高度|
|returnType|String|否|polymerization| - |设定参数返回格式|

#### 事件

|名称|说明|回调参数
|:----|:----|:----|
|bind:confirm|点击确定按钮|当returnType为polymerization时返回一个数组对象，当returnType为dispersed时返回一个对象|
|bind:cancel|点击取消按钮| - |

#### 参数返回格式

|方式|说明|返回示例
|:----|:----|:----|
|polymerization|聚合返回形式|```[{code: 150000, name: "内蒙古自治区"}, {code: 150400, name: "赤峰市"}, {code: 150426, name: "翁牛特旗"}```|
|dispersed|分散返回形式|```code: [140000, 140200, 140213], name: ["山西省", "大同市", "平城区"]```|
