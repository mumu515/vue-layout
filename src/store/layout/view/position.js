export default () => ({
  path: "/corehr/POSITION/index/view",
  scopes: [
    {
      scopeId: 1,
      data: {
        detailData: {}
      },
      action: {
        init: ["getData"],
        getData: [
          {
            type: "api",
            config: {
              url: "{\"/biz/\"+objectCode+\"/\"+instanceId}",
              type: "GET",
              headers: {},
              params: {
                depth: 6,
                asOfDate: "{asOfDate}"
              },
              $response: {
                data: "{detailData}",
                message: "{message}"
              }
            }
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
          }]
      }
    }
  ],
  layout: {
    nodeType: "el-container",
    props: {direction: "vertical"},
    scopeId: 1,
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
            innerHTML: "查看职位",
            style: {flex: "auto"}
          },
          {
            nodeType: "span",
            innerHTML: "截止日期",
            style: {"margin-right": "20px"}
          },
          {
            nodeType: "y-date-picker",
            props: {
              prop: "asOfDate",
              displayOnly: true,
              "value-format": "yyyyMMdd",
              format: "yyyy-MM-dd",
              model: {asOfDate: "{asOfDate}"}
            }
          }
        ]
      },
      {
        nodeType: "el-container",
        props: {direction: "vertical"},
        children: [
          {
            nodeType: "el-card",
            style: {margin: "20px 20px 0 20px"},
            children: [
              {
                nodeType: "el-container",
                children: [
                  {
                    nodeType: "el-form",
                    style: {flex: "auto"},
                    props: {
                      model: "{detailData}",
                      "label-width": "140px",
                      "label-position": "left"
                    },
                    children: [
                      {
                        nodeType: "el-form-item",
                        style: {margin: 0},
                        children: [
                          {
                            nodeType: "span",
                            innerHTML: "编码",
                            slot: "label",
                            style: {color: "#999999"}
                          },
                          {
                            nodeType: "y-input",
                            props: {
                              displayOnly: true,
                              prop: "code"
                            }
                          }
                        ]
                      },
                      {
                        nodeType: "el-form-item",
                        style: {margin: 0},
                        children: [
                          {
                            nodeType: "span",
                            innerHTML: "名称",
                            slot: "label",
                            style: {color: "#999999"}
                          },
                          {
                            nodeType: "y-input",
                            props: {
                              displayOnly: true,
                              prop: "name"
                            }
                          }
                        ]
                      }]
                  }
                  // {
                  //   nodeType: "el-dropdown", style: {flex: "none", "align-self": "center"}, children: [
                  //     {
                  //       nodeType: "el-button", props: {type: "primary"}, children: [
                  //         {nodeType: "span", innerHTML: "Action"},
                  //         {nodeType: "i", class: "el-icon-arrow-down el-icon--right"}
                  //       ]
                  //     },
                  //     {
                  //       nodeType: "el-dropdown-menu", slot: "dropdown", children: [
                  //         {
                  //           nodeType: "el-dropdown-item", children: [{nodeType: "el-button", props: {type: "text"}, innerHTML: "action2"}]
                  //         },
                  //         {
                  //           nodeType: "el-dropdown-item", children: [{nodeType: "el-button", props: {type: "text"}, innerHTML: "action3"}]
                  //         },
                  //         {nodeType: "el-dropdown-item", children: [{nodeType: "el-button", props: {type: "text"}, innerHTML: "action4"}]}
                  //       ]
                  //     }
                  //   ]
                  // }
                ]
              }]
          },
          {
            nodeType: "el-card",
            style: {margin: "20px 20px 0 20px"},
            children: [
              {
                nodeType: "el-tabs",
                children: [
                  {
                    nodeType: "el-tab-pane",
                    props: {label: "详情"},
                    children: [
                      {
                        nodeType: "y-pre-form",
                        style: {margin: "0 40px"},
                        props: {
                          model: "{detailData}",
                          items: [
                            {
                              type: "text",
                              props: {label: "编码"},
                              itemProps: {
                                prop: "code",
                                displayOnly: true
                              }
                            },
                            {
                              type: "text",
                              props: {label: "名称"},
                              itemProps: {
                                prop: "name",
                                displayOnly: true
                              }
                            },
                            {
                              type: "select",
                              props: {label: "生效状态"},
                              itemProps: {
                                prop: "status",
                                displayOnly: true,
                                optionsPath: "JOB.status",
                                filter: {params: {asOfDate: "{asOfDate}"}}
                              }
                            },
                            {
                              type: "text",
                              props: {label: "描述"},
                              itemProps: {
                                prop: "description",
                                "displayOnly": true
                              }
                            }, {
                              type: "select",
                              props: {label: "上级"},
                              itemProps: {
                                prop: "superior",
                                displayOnly: true,
                                optionsPath: "ORGANIZATION.superior",
                                filter: {params: {asOfDate: "{asOfDate}"}}
                              }
                            }]
                        }
                      }]
                  }]
              }]
          }
        ]
      }
    ]
  }
})
