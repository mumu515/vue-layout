export default () => ({
  path: "/corehr/EMPLOYEE/index/list",
  scopes: [
    {
      scopeId: 1,
      data: {
        locale: {},
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
        init: [
          {
            type: "api",
            config: {
              url: "/biz/LOCALE/search",
              type: "POST",
              headers: {},
              params: {},
              data: {"code": "CHN"},
              $response: {data: {instances: ["{locale.CHN}"]}}
            }
          }, "search"],
        searchParamsConfirm: [
          {
            type: "eval",
            config: {eval: "searchParams.search=window.JSON.parse(window.JSON.stringify(searchParams.current))"}
          }],
        search: [
          {
            type: "eval",
            config: {eval: "pagination.page=1"}
          },
          "changePage"],
        changePage: [
          "searchParamsConfirm",
          {
            type: "api",
            config: {
              url: "{\"/biz/\"+objectCode+\"/search\"}",
              type: "POST",
              headers: {},
              params: {
                depth: 3,
                page: "{pagination.page}",
                pageSize: "{pagination.pageSize}",
                asOfDate: "{searchParams.search.asOfDate}"
              },
              data: {
                "employment.employeeId": "{searchParams.search.employeeId||undefined}",
                "personal.names.nameCHN.displayName": "{searchParams.search.displayName||undefined}",
                "personal.names.type": "{searchParams.search.displayName?\"PREFERRED\":undefined}",
                "personal.names.locale.instanceId": "{searchParams.search.displayName?locale.CHN.instanceId:undefined}",
                "employment.employmentType": "{searchParams.search.employmentType||undefined}",
                "employment.employmentStatus": "{searchParams.search.employmentStatus||undefined}",
                "organizations.organization.instanceId": "{searchParams.search.organization||undefined}",
                "organizations.type": "{searchParams.search.organization?\"MANAGEMENT\":undefined}",
                "organizations.assignmentType": "{searchParams.search.organization?\"HR\":undefined}"
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
        // toAdd: [{
        //   type: "process",
        //   config: {
        //     processUrl: "/process/start/1002",
        //     payload: {
        //       objectCode: "{objectCode}",
        //       pageType: "add"
        //     }
        //   }
        // }],
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
                innerHTML: "员工管理",
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
                    // style: {flex: "auto"},
                    props: {
                      model: "{searchParams.current}",
                      rules: {
                        employeeId: {
                          required: "{!searchParams.current.displayName}",
                          message: "员工号和显示姓名必须选填一个"
                        },
                        displayName: {
                          required: "{!searchParams.current.employeeId}",
                          message: "员工号和显示姓名必须选填一个"
                        }
                      },
                      inline: true,
                      labelPosition: "top",
                      items: [
                        {
                          type: "text",
                          props: {
                            label: "员工号",
                            prop: "employeeId"
                          },
                          itemProps: {prop: "employeeId"}
                        },
                        {
                          type: "text",
                          props: {
                            label: "显示姓名",
                            prop: "displayName"
                          },
                          itemProps: {prop: "displayName"}
                        },
                        {
                          type: "select",
                          props: {
                            label: "员工类型",
                            prop: "employmentType"
                          },
                          itemProps: {
                            prop: "employmentType",
                            optionsPath: "EMPLOYMENT.employmentType",
                            filter: {params: {asOfDate: "{searchParams.current.asOfDate}"}}
                          }
                        },
                        {
                          type: "select",
                          props: {
                            label: "在职状态",
                            prop: "employmentStatus"
                          },
                          itemProps: {
                            prop: "employmentStatus",
                            optionsPath: "EMPLOYMENT.employmentStatus",
                            filter: {params: {asOfDate: "{searchParams.current.asOfDate}"}}
                          }
                        },
                        {
                          type: "select",
                          props: {
                            label: "管理组织",
                            prop: "organization"
                          },
                          itemProps: {
                            prop: "organization",
                            optionsPath: "ORGANIZATION",
                            filter: {
                              data: {type: "MANAGEMENT"},
                              params: {asOfDate: "{searchParams.current.asOfDate}"}
                            }
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
                        innerHTML: "入职新员工",
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
                          label: "员工号",
                          prop: "employment[0].employeeId"
                        }
                      },
                      {
                        nodeType: "el-table-column",
                        props: {label: "显示姓名"},
                        scopedSlots: {
                          default: {
                            scopeMapping: {row: "row"},
                            nodeType: "y-input",
                            props: {
                              displayOnly: true,
                              model: "{row}",
                              prop: "$.personal[0].names[?(@.locale[0].code==\"CHN\"&&@.type==\"PREFERRED\")].nameCHN[0].displayName"
                            }
                          }
                        }
                      },
                      {
                        nodeType: "el-table-column",
                        props: {label: "员工类型"},
                        scopedSlots: {
                          default: {
                            scopeMapping: {row: "row"},
                            nodeType: "y-select",
                            props: {
                              displayOnly: true,
                              model: "{row}",
                              prop: "employment[0].employmentType",
                              filter: {params: {asOfDate: "{searchParams.search.asOfDate}"}},
                              optionsPath: "EMPLOYMENT.employmentType"
                            }
                          }
                        }
                      },
                      {
                        nodeType: "el-table-column",
                        props: {label: "在职状态"},
                        scopedSlots: {
                          default: {
                            scopeMapping: {row: "row"},
                            nodeType: "y-select",
                            props: {
                              displayOnly: true,
                              model: "{row}",
                              prop: "employment[0].employmentStatus",
                              filter: {params: {asOfDate: "{searchParams.search.asOfDate}"}},
                              optionsPath: "EMPLOYMENT.employmentStatus"
                            }
                          }
                        }
                      },
                      {
                        nodeType: "el-table-column",
                        props: {label: "管理组织"},
                        scopedSlots: {
                          default: [
                            {
                              nodeType: "y-select",
                              scopeMapping: {
                                row: "row",
                                key: "row.instanceId"
                              },
                              props: {
                                displayOnly: true,
                                model: "{row}",
                                optionsPath: "ORGANIZATION",
                                filter: {params: {asOfDate: "{searchParams.search.asOfDate}"}},
                                prop: "$.organizations[?(@.assignmentType==\"HR\"&&@.type==\"MANAGEMENT\")].organization[0].instanceId"
                              }
                            }]
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
