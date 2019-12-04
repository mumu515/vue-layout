export default () => ({
  path: "/corehr/PAY_COMPONENT/index/list",
  scopes: [
    {
      scopeId: 1,
      data: {
        searchParams: {
          search: {},
          current: {asOfDate: new Date().mFormat("yyyyMMdd")}
        },
        pagination: {
          page: 1,
          pageSize: 10,
          total: 0
        },
        list: [],
        detailInstanceId: 0
      },
      action: {
        init: ["search"],
        searchParamsConfirm: [
          {
            type: "eval",
            config: {eval: "searchParams.search=window.JSON.parse(window.JSON.stringify(searchParams.current))"}
          }],
        search: [
          {
            type: "eval",
            config: {eval: "pagination.page=1"}
          }, "changePage"],
        changePage: [
          "searchParamsConfirm",
          {
            type: "api",
            config: {
              url: "{\"/biz/\"+objectCode+\"/search\"}",
              type: "POST",
              headers: {},
              params: {
                depth: 1,
                page: "{pagination.page}",
                pageSize: "{pagination.pageSize}",
                asOfDate: "{searchParams.search.asOfDate}"
              },
              data: {
                "code": "{searchParams.search.code||undefined}",
                "name": "{searchParams.search.name||undefined}",
                "class": "{searchParams.search.class||undefined}"
              },
              $response: {
                data: {
                  instances: "{list}",
                  page: "{pagination.page}",
                  pageSize: "{pagination.pageSize}",
                  total: "{pagination.total}"
                }
              }
            }
          }],
        toAdd: [
          {
            type: "route",
            config: {
              action: "push",
              name: "CorehrObjectLayout",
              params: {pageType: "add"},
              query: {asOfDate: "{searchParams.search.asOfDate}"}
            }
          }],
        toDetail: [
          {
            type: "route",
            config: {
              action: "push",
              name: "CorehrObjectLayout",
              params: {pageType: "view"},
              query: {
                instanceId: "{detailInstanceId}",
                asOfDate: "{searchParams.search.asOfDate}"
              }
            }
          }],
        toEdit: [
          {
            type: "route",
            config: {
              action: "push",
              name: "CorehrEdit",
              params: {instanceId: "{detailInstanceId}"},
              query: {asOfDate: "{searchParams.search.asOfDate}"}
            }
          }]
      }
    }
  ],
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
            nodeType: "el-container",
            class: "header-part page-header",
            style: {"align-items": "center"},
            children: [
              {
                nodeType: "h2",
                innerHTML: "薪酬项管理",
                style: {margin: "0 !important"}
              }]
          }]
      },
      {
        nodeType: "el-card",
        style: {
          margin: "20px",
          flex: "auto",
          display: "flex"
        },
        props: {
          "body-style": {
            flex: "auto",
            padding: 0
          }
        },
        children: [
          {
            nodeType: "el-scrollbar",
            children: [
              {
                nodeType: "el-main",
                style: {padding: "20px"},
                children: [
                  {
                    nodeType: "y-pre-form",
                    props: {
                      model: "{searchParams.current}",
                      rules: {
                        code: {required: "{!searchParams.current.name}"},
                        name: {required: "{!searchParams.current.code}"},
                        asOfDate: {required: true}
                      },
                      inline: true,
                      labelPosition: "top",
                      items: [
                        {
                          type: "text",
                          props: {label: "编码"},
                          itemProps: {prop: "code"}
                        },
                        {
                          type: "text",
                          props: {label: "名称"},
                          itemProps: {prop: "name"}
                        },
                        {
                          type: "select",
                          props: {label: "类别"},
                          itemProps: {
                            prop: "class",
                            optionsPath: "PAY_COMPONENT.class"
                          }
                        },
                        {
                          type: "date",
                          props: {
                            label: "截止日期",
                            prop: "asOfDate"
                          },
                          itemProps: {
                            prop: "asOfDate",
                            "valueFormat": "yyyyMMdd"
                          }
                        }
                      ]
                    },
                    children: [
                      {
                        nodeType: "el-form-item",
                        children: [
                          {
                            nodeType: "div",
                            innerHTML: "操作",
                            slot: "label",
                            class: "transparent"
                          },
                          {
                            nodeType: "y-button",
                            props: {
                              size: "mini",
                              type: "primary",
                              "formSubmit": true
                            },
                            innerHTML: "搜索",
                            on: {click: {actionName: "search"}}
                          }]
                      }]
                  },
                  //列表操作
                  {
                    nodeType: "el-container",
                    style: {"padding-bottom": "10px"},
                    children: [
                      {
                        nodeType: "el-button",
                        props: {
                          size: "mini",
                          type: "primary"
                        },
                        innerHTML: "创建新薪酬项",
                        on: {click: {actionName: "toAdd"}}
                      }]
                  },
                  //列表
                  {
                    nodeType: "el-table",
                    // props: {data: []},
                    props: {data: "{list}"},
                    children: [
                      {
                        nodeType: "el-table-column",
                        props: {
                          label: "编码",
                          prop: "code"
                        }
                      },
                      {
                        nodeType: "el-table-column",
                        props: {
                          label: "名称",
                          prop: "name"
                        }
                      },
                      {
                        nodeType: "el-table-column",
                        props: {label: "类别"},
                        scopedSlots: {
                          default: {
                            scopeMapping: {row: "row"},
                            nodeType: "y-select",
                            props: {
                              displayOnly: true,
                              model: "{row}",
                              prop: "class",
                              optionsPath: "PAY_COMPONENT.class"
                            }
                          }
                        }
                      },
                      {
                        nodeType: "el-table-column",
                        props: {
                          label: "操作",
                          align: "center"
                        },
                        scopedSlots: {
                          default: [
                            {
                              nodeType: "el-button",
                              innerHTML: "查看",
                              props: {type: "text"},
                              scopeMapping: {
                                row: "row",
                                index: "index"
                              },
                              style: {color: "#189CFF"},
                              on: {
                                click: {
                                  actionName: "toDetail",
                                  $params: {append: {data: {row: {instanceId: "{detailInstanceId}"}}}}
                                }
                              }
                            }
                          ]
                        }
                      }]
                  },
                  //分页
                  {
                    nodeType: "el-pagination",
                    class: "pagination",
                    props: {
                      background: true,
                      layout: "prev, pager, next, jumper",
                      "current-page": "{pagination.page}",
                      "total": "{pagination.total}",
                      "page-size": "{pagination.pageSize}"
                    },
                    on: {
                      "current-change": {
                        actionName: "changePage",
                        $params: {arguments: ["{pagination.page}"]}
                      }
                    }
                  }]
              }]
          }]
      }
    ]
  }
});
