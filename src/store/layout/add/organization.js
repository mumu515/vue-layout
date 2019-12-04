export default () => ({
  path: "/corehr/ORGANIZATION/index/add",
  scopes: [
    {
      scopeId: 1,
      data: {
        formData: {}
      },
      action: {
        init: [
          {
            type: "eval",
            config: {eval: "formData.effectiveDate = new Date().mFormat('yyyyMMdd')"}
          }],
        toList: [
          {
            type: "route",
            config: {
              action: "replace",
              name: "CorehrObjectLayout",
              params: {pageType: "list"},
            }
          }],
        back: [
          {
            type: "route",
            config: {action: "back"}
          }],
        submit: [
          {
            type: "api",
            config: {
              url: "/biz/api",
              type: "POST",
              headers: {},
              data: {
                events: [
                  {
                    eventCode: "New_Organization",
                    effectiveDate: "{formData.effectiveDate}",
                    data: [
                      {
                        payload: {
                          "code": "{formData.code}",
                          "name": "{formData.name}",
                          "status": "{formData.status}",
                          "type": "{formData.type}",
                          "subType": "{formData.subType}",
                          "description": "{formData.description}",
                          "superior": "{formData.superior}",
                          "manager": "{formData.manager}"
                        }
                      }]
                  }]
              }
            }
          }, "toList"]
      }
    }],
  layout: {
    nodeType: "el-container",
    class: "main-container",
    props: {direction: "vertical"},
    scopeId: 1,
    children: [
      {
        nodeType: "el-row",
        children: [
          {
            nodeType: "el-col",
            props: {
              tag: "div",
              span: 24
            },
            children: [
              {
                nodeType: "el-container",
                class: "header-part page-header",
                style: {"align-items": "center"},
                children: [
                  {
                    nodeType: "i",
                    class: "el-icon-arrow-left icon-back",
                    style: {"margin-right": "40px"},
                    on: {click: {actionName: "toList"}}
                  },
                  {
                    nodeType: "h2",
                    innerHTML: "新建组织",
                    style: {flex: "auto"}
                  }
                ]
              }]
          }]
      },
      {
        nodeType: "el-scrollbar",
        children: [
          {
            nodeType: "el-container",
            style: {"margin-bottom": "20px"},
            props: {direction: "vertical"},
            children: [
              {
                nodeType: "el-form",
                props: {model: "{formData}"},
                children: [
                  {
                    nodeType: "el-card",
                    style: {margin: "20px 20px 0 20px"},
                    props: {
                      header: "组织",
                      "body-style": {"padding": "0"}
                    },
                    children: [
                      {
                        nodeType: "y-pre-form",
                        style: {padding: "40px 20px 30px 20px"},
                        props: {
                          model: "{formData}",
                          labelPosition: "top",
                          span: 2,
                          maxLine: 2,
                          inline: true,
                          items: [
                            {
                              props: {
                                label: "生效日期",
                                prop: "effectiveDate",
                                required: true
                              },
                              type: "date",
                              itemProps: {
                                prop: "effectiveDate",
                                defaultValue: "",
                                valueFormat: "yyyyMMdd"
                              }
                            },
                            {
                              props: {
                                label: "编码",
                                prop: "code",
                                required: true
                              },
                              type: "text",
                              itemProps: {
                                prop: "code",
                                defaultValue: ""
                              }
                            },
                            {
                              props: {
                                label: "名称",
                                prop: "name",
                                required: true
                              },
                              type: "text",
                              itemProps: {
                                prop: "name",
                                defaultValue: ""
                              }
                            },
                            {
                              props: {
                                label: "生效状态",
                                prop: "status",
                                required: true
                              },
                              type: "select",
                              itemProps: {
                                prop: "status",
                                defaultValue: "",
                                optionsPath: "ORGANIZATION.status",
                                filter: {params: {asOfDate: "{formData.effectiveDate}"}}
                              }
                            },
                            {
                              props: {
                                label: "类型",
                                prop: "type",
                                required: true
                              },
                              type: "select",
                              itemProps: {
                                prop: "type",
                                defaultValue: "",
                                optionsPath: "ORGANIZATION.type",
                                filter: {params: {asOfDate: "{formData.effectiveDate}"}}
                              }
                            },
                            {
                              props: {label: "子类型"},
                              type: "select",
                              itemProps: {
                                prop: "subType",
                                defaultValue: "",
                                optionsPath: "ORGANIZATION.subType",
                                filter: {params: {asOfDate: "{formData.effectiveDate}"}}
                              }
                            },
                            {
                              props: {label: "描述"},
                              type: "text",
                              itemProps: {
                                type: "text",
                                prop: "description",
                                defaultValue: ""
                              }
                            },
                            {
                              props: {label: "上级"},
                              type: "select",
                              itemProps: {
                                prop: "superior",
                                defaultValue: "",
                                optionsPath: "ORGANIZATION.superior",
                                filter: {params: {asOfDate: "{formData.effectiveDate}"}}
                              }
                            },
                            {
                              props: {label: "管理者"},
                              type: "select",
                              itemProps: {
                                prop: "manager",
                                defaultValue: "",
                                optionsPath: "ORGANIZATION.manager",
                                labelKey: "$.personal[0].names[?(@.locale[0].code==\"CHN\"&&@.type==\"PREFERRED\")].nameCHN[0].displayName",
                                remoteFilterKey: "personal.names.nameCHN.displayName",
                                filter: {
                                  params: {asOfDate: "{formData.effectiveDate}"},
                                  data: {"personal.names.type": "PREFERRED"}
                                }
                              }
                            }
                          ]
                        }
                      }]
                  }]
              }]
          }]
      },
      {
        nodeType: "el-row",
        children: [
          {
            nodeType: "el-col",
            children: [
              {
                nodeType: "el-card",
                children: [
                  {
                    nodeType: "el-row",
                    props: {type: "flex"},
                    style: {"justify-content": "center"},
                    children: [
                      {
                        nodeType: "div",
                        style: {flex: "none"},
                        children: [
                          {
                            nodeType: "y-button",
                            props: {
                              size: "mini",
                              type: "primary"/* "formSubmit": true*/
                            },
                            innerHTML: "提交保存",
                            on: {click: {actionName: "submit"}}
                          },
                          {
                            nodeType: "el-button",
                            props: {size: "mini"},
                            innerHTML: "取消",
                            on: {click: {actionName: "toList"}}
                          }]
                      }]
                  }]
              }]
          }]
      }
    ]
  }
})
