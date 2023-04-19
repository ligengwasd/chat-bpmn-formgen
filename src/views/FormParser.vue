<template>
    <div>
        <form-create :rule="rule" v-model:api="fApi" :option="options" v-model="value"/>
        <form-create :rule="httpClient.rule" :option="httpClient.options" />

    </div>
</template>

<script>
export default {
    data(){
        return {
            fApi:{},
            value:{field1:'111',field2:'222',time:'11:11:11'},
            options:{
                onSubmit:(formData)=>{
                    alert(JSON.stringify(formData))
                }
            },
            rule:[
                {type:'input', field:'field1',title:'field1',value:'aaa'},
                {type:'input', field:'field2',title:'field2',value:'sss'},
                {type:'timePicker', field:'time',title:'time',value:'12:12:12'},
                {
                    type:'ElButton',
                    title:'修改 field1',
                    native: false,
                    on:{
                        click: ()=>{
                            this.rule[0].value+='a'
                        }
                    },
                    children: ['点击'],
                }
            ],
            httpMethod:"",
            httpUrl:"",
            httpClient:{
                rule:[
                    {
                        "type": "select",
                        "field": "httpMethod",
                        "title": "请求方式",
                        "info": "请求方式",
                        "props": {
                            "_optionType": 2
                        },
                        "_fc_drag_tag": "select",
                        "hidden": false,
                        "display": true,
                        "options": [
                            {
                                "label": "GET",
                                "value": "GET"
                            },
                            {
                                "label": "POST",
                                "value": "POST"
                            }
                        ]
                    },
                    {
                        "type": "FcRow",
                        "_fc_drag_tag": "row",
                        "hidden": false,
                        "display": true
                    },
                    {
                        "type": "input",
                        "field": "httpUrl",
                        "title": "请求地址",
                        "info": "",
                        "_fc_drag_tag": "input",
                        "hidden": false,
                        "display": true
                    },
                    {
                        "type": "input",
                        "field": "httpBody",
                        "title": "请求体",
                        "info": "",
                        "_fc_drag_tag": "input",
                        "hidden": false,
                        "display": true
                    }
                ],
                options:{
                    "form": {
                        "labelPosition": "right",
                        "size": "medium",
                        "labelWidth": "125px",
                        "hideRequiredAsterisk": false,
                        "showMessage": true,
                        "inlineMessage": false
                    },
                    "submitBtn": false,
                    "resetBtn": false
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
