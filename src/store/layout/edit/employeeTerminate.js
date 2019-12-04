export default () => ({
  path: "/corehr/EMPLOYEE/index/add",
  scopes: [
    {
      scopeId: 1,
      data: {
        formData: {}
      },
      action: {
        init: [
          {
            type: "api",
            config: {
              url: "{\"/biz/\"+objectCode+\"/\"+instanceId}",
              type: "GET",
              headers: {},
              params: {
                depth: 3,
                asOfDate: "{asOfDate}"
              },
              $response: {data: "{formData}"}
            }
          }],
        toList: [
          {
            type: "route",
            config: {
              action: "replace",
              path: "/corehr/EMPLOYEE/index/list"
            }
          }],
        submit: [
          {
            type: "api",
            config: {
              url: "/biz/api",
              type: "POST",
              headers: {},
              data: {
                events: "{Utils.getEvalArrayByTemplate(" +
                  " formData.workRelationships," +
                  " {" +
                  "  eventCode:\"Terminate_Employee_WorkRelationship\"," +
                  "  effectiveDate:\"{terminationDate.replace(/-/g,'')}\"," +
                  "  data:[{payload:{instanceId:\"{instanceId}\",terminationDate:\"{terminationDate}\",lastWorkDate:\"{lastWorkDate}\",workRelationshipStatus:\"INACTIVE\"}}]" +
                  " }," +
                  " [" +
                  "   Utils.getEvalScopeData(" +
                  "     formData," +
                  "     {" +
                  "       eventCode:\"Terminate_Employee_Employment\"," +
                  "       effectiveDate:\"{workRelationships[0].terminationDate.replace(/-/g,'')}\"," +
                  "       data:[{payload:{instanceId:\"{employment[0].instanceId}\",employmentStatus:\"INACTIVE\"}}]" +
                  "     }" +
                  "   )" +
                  " ]" +
                  ")}"
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
                    style: {flex: "auto"},
                    children: [
                      {
                        nodeType: "span",
                        innerHTML: "离职员工:"
                      },
                      {
                        nodeType: "span",
                        innerHTML: "{formData.employment[0].employeeId}"
                      },
                      {
                        nodeType: "span",
                        innerHTML: "-"
                      },
                      {
                        nodeType: "span",
                        innerHTML: "{formData.personal[0].names[0].nameCHN[0].displayName}"
                      }
                    ]
                  }
                ]
              }]
          }]
      },
      {
        nodeType: "el-form",
        style: {
          height: "calc(100vh - 250px)",
          "margin-bottom": "20px"
        },
        props: {model: "{formData}"},
        children: [
          {
            nodeType: "el-scrollbar",
            children: [
              {
                nodeType: "el-card",
                props: {"body-style": {padding: "0"}},
                style: {margin: "20px 20px 0 20px"},
                children: [
                  {
                    nodeType: "el-row",
                    slot: "header",
                    props: {type: "flex"},
                    style: {"align-items": "center"},
                    children: [
                      {
                        nodeType: "div",
                        style: {flex: "auto"},
                        class: "required",
                        innerHTML: "劳动关系"
                      }]
                  },
                  {
                    nodeType: "y-list",
                    style: {padding: "10px 20px 30px 20px"},
                    props: {forList: "{formData.workRelationships}"},
                    scopedSlots: {
                      default: [
                        {
                          nodeType: "y-pre-form",
                          scopeMapping: {itemModel: "item"},
                          props: {
                            model: "{itemModel}",
                            labelPosition: "top",
                            span: 3,
                            inline: true,
                            items: [
                              {
                                type: "select",
                                props: {label: "分配类型"},
                                itemProps: {
                                  defaultValue: "",
                                  prop: "assignmentType",
                                  displayOnly: true,
                                  optionsPath: "WORK_RELATIONSHIPS.assignmentType"
                                }
                              },
                              {
                                type: "text",
                                props: {label: "劳动关系ID"},
                                itemProps: {
                                  defaultValue: "",
                                  displayOnly: true,
                                  prop: "workRelationshipId"
                                }
                              },
                              {
                                type: "select",
                                props: {label: "劳动关系类型"},
                                itemProps: {
                                  defaultValue: "",
                                  prop: "workRelationshipType",
                                  displayOnly: true,
                                  optionsPath: "WORK_RELATIONSHIPS.workRelationshipType"
                                }
                              },
                              {
                                type: "date",
                                props: {
                                  label: "离职日期",
                                  prop: "terminationDate",
                                  required: true
                                },
                                itemProps: {
                                  defaultValue: "",
                                  prop: "terminationDate"
                                }
                              },
                              {
                                type: "date",
                                props: {
                                  label: "最后工作日",
                                  prop: "lastWorkDate",
                                  required: true
                                },
                                itemProps: {
                                  defaultValue: "",
                                  prop: "lastWorkDate"
                                }
                              }
                            ]
                          }
                        }]
                    }
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
