export default () => ({
  path: "/corehr/EMPLOYEE/index/add",
  scopes: [
    {
      scopeId: 1,
      data: {
        activeConfig: {activeIndex: 0},
        formData: {
          personData: {
            "externalId": "$instance:1",
            "biographical": {},
            "personRegional": {"personRegionalCHN": {}}
          },
          employeeData: {
            "personal": {"PERSON_EXTERNALID_UNIQUE": "$instance:1"},
            "employment": {"employmentStatus": "ACTIVE"},
            "compensation": {},
            "workRelationships": [{"workRelationshipStatus": "ACTIVE"}],
            "jobs": [{}],
            "organizations": [{}]
          }
        }
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
              $response: {data: {instances: [{instanceId: "{formData.personData.names[0].locale}"}]}}
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
                    eventCode: "New_Employee_Person",
                    effectiveDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}",
                    data: [{payload: "{formData.personData}"}]
                  },
                  {
                    eventCode: "New_Employee",
                    effectiveDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}",
                    data: [{payload: "{formData.employeeData}"}]
                  }
                ]
              }
            }
          }, "toList"]
      }
    },
    {
      scopeId: 2,
      data: {locale: {CHN: {}}},
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
          }]
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
                    innerHTML: "入职新员工",
                    style: {flex: "auto"}
                  }
                ]
              }]
          }]
      },
      {
        nodeType: "el-form",
        props: {model: "{formData}"},
        children: [
          {
            nodeType: "y-carousel",
            class: "y-carousel-no-animate",
            props: {
              containerDirection: "vertical",
              height: "calc(100vh - 230px)",
              autoplay: false,
              "indicator-position": "none",
              arrow: "never",
              "initial-index": "{activeConfig.activeIndex}"
            },
            scopedSlots: {
              actions: {
                scopeMapping: {carousel: "carousel"},
                nodeType: "el-row",
                style: {flex: "none"},
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
                                    vIf: "{activeConfig.activeIndex===0}",
                                    props: {size: "mini"},
                                    innerHTML: "返回",
                                    on: {click: {actionName: "toList"}}
                                  },
                                  {
                                    nodeType: "y-button",
                                    vIf: "{activeConfig.activeIndex!==0}",
                                    props: {size: "mini"},
                                    innerHTML: "上一步",
                                    on: {click: "activeConfig.activeIndex--;carousel.setActiveItem(activeConfig.activeIndex)"}
                                  },
                                  {
                                    nodeType: "el-button",
                                    vIf: "{activeConfig.activeIndex!==4}",
                                    props: {
                                      size: "mini",
                                      type: "primary"
                                    },
                                    innerHTML: "下一步",
                                    on: {click: "activeConfig.activeIndex++;carousel.setActiveItem(activeConfig.activeIndex)"}
                                  },
                                  {
                                    nodeType: "el-button",
                                    vIf: "{activeConfig.activeIndex===4}",
                                    props: {
                                      size: "mini",
                                      type: "primary"
                                    },
                                    innerHTML: "提交",
                                    on: {click: {actionName: "submit"}}
                                  }]
                              }]
                          }]
                      }]
                  }]
              }
            },
            children: [
              {
                nodeType: "el-carousel-item",
                props: {name: "carouselItem0"},
                children: [
                  {
                    nodeType: "el-container",
                    style: {height: "100%"},
                    props: {direction: "vertical"},
                    children: [
                      {
                        nodeType: "el-scrollbar",
                        style: {
                          flex: "auto",
                          "margin-bottom": "20px"
                        },
                        children: [
                          {
                            nodeType: "ySteps",
                            props: {stepPosition: "right"},
                            children: [
                              {
                                nodeType: "el-container",
                                props: {"direction": "vertical"},
                                children: [
                                  // 个人信息
                                  {
                                    nodeType: "el-card",
                                    style: {margin: "20px 20px 0 20px"},
                                    props: {
                                      header: "档案资料",
                                      "body-style": {"padding": "0"}
                                    },
                                    children: [
                                      {
                                        nodeType: "y-pre-form",
                                        style: {padding: "40px 20px 30px 20px"},
                                        props: {
                                          model: "{formData.personData.biographical}",
                                          labelPosition: "top",
                                          span: 2,
                                          inline: true,
                                          items: [
                                            {
                                              props: {label: "出生日期"},
                                              type: "date",
                                              itemProps: {
                                                prop: "dateOfBirth",
                                                defaultValue: ""
                                              }
                                            },
                                            {
                                              props: {label: "出生国家地区"},
                                              type: "select",
                                              itemProps: {
                                                prop: "birthLocale",
                                                optionsPath: "LOCALE",
                                                filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
                                                defaultValue: ""
                                              }
                                            }
                                          ]
                                        }
                                      }]
                                  },
                                  //中国-本地信息
                                  {
                                    nodeType: "el-card",
                                    style: {margin: "20px 20px 0 20px"},
                                    props: {
                                      header: "本地信息(中国)",
                                      "body-style": {"padding": "0"}
                                    },
                                    children: [
                                      {
                                        nodeType: "y-pre-form",
                                        style: {"padding": "40px 20px 30px 20px"},
                                        props: {
                                          model: "{formData.personData.personRegional.personRegionalCHN}",
                                          labelPosition: "top",
                                          span: 2,
                                          inline: true,
                                          items: [
                                            {
                                              type: "select",
                                              props: {label: "国籍"},
                                              itemProps: {
                                                prop: "nationality",
                                                defaultValue: "",
                                                optionsPath: "PERSON_REGIONAL_CHN.nationality"
                                              }
                                            },
                                            {
                                              type: "select",
                                              props: {label: "性别"},
                                              itemProps: {
                                                prop: "gender",
                                                defaultValue: "",
                                                filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
                                                optionsPath: "PERSON_REGIONAL_CHN.gender"
                                              }
                                            },
                                            {
                                              type: "select",
                                              props: {label: "婚姻状态"},
                                              itemProps: {
                                                prop: "maritalStatus",
                                                defaultValue: "",
                                                filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
                                                optionsPath: "PERSON_REGIONAL_CHN.maritalStatus"
                                              }
                                            },
                                            {
                                              type: "select",
                                              props: {label: "户口"},
                                              itemProps: {
                                                prop: "huKou",
                                                defaultValue: "",
                                                filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
                                                optionsPath: "PERSON_REGIONAL_CHN.huKou"
                                              }
                                            },
                                            {
                                              type: "select",
                                              props: {label: "民族"},
                                              itemProps: {
                                                prop: "ethnicity",
                                                defaultValue: "",
                                                filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
                                                optionsPath: "PERSON_REGIONAL_CHN.ethnicity"
                                              }
                                            },
                                            
                                            {
                                              type: "select",
                                              props: {label: "政治面貌"},
                                              itemProps: {
                                                prop: "politicsStatus",
                                                defaultValue: "",
                                                filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
                                                optionsPath: "PERSON_REGIONAL_CHN.politicsStatus"
                                              }
                                            }
                                          ]
                                        }
                                      }]
                                  },
                                  //姓名
                                  {
                                    nodeType: "el-card",
                                    style: {margin: "20px 20px 0 20px"},
                                    props: {"body-style": {padding: "0"}},
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
                                            innerHTML: "姓名"
                                          },
                                          {
                                            nodeType: "i",
                                            scopeId: 2,
                                            class: "el-icon-plus",
                                            on: {
                                              click: "{" +
                                                "formData.personData.names=formData.personData.names||[];" +
                                                "formData.personData.names.push({nameCHN:{},locale:locale.CHN.instanceId})}"
                                            }
                                          }]
                                      },
                                      {
                                        nodeType: "y-list",
                                        vIf: "{formData.personData.names&&formData.personData.names.length}",
                                        style: {padding: "10px 20px 30px 20px"},
                                        props: {forList: "{formData.personData.names}"},
                                        scopedSlots: {
                                          default: [
                                            {
                                              nodeType: "el-row",
                                              scopeMapping: {
                                                itemModel: "item",
                                                index: "index"
                                              },
                                              props: {type: "flex"},
                                              style: {
                                                height: "30px",
                                                "justify-content": "flex-end",
                                                "align-items": "flex-end"
                                              },
                                              children: [
                                                {
                                                  nodeType: "i",
                                                  class: "el-icon-delete",
                                                  on: {click: "{formData.personData.names.splice(index,1)}"}
                                                }]
                                            },
                                            {
                                              nodeType: "y-pre-form",
                                              scopeMapping: {
                                                itemModel: "item",
                                                index: "index"
                                              },
                                              props: {
                                                model: "{itemModel}",
                                                labelPosition: "top",
                                                span: 2,
                                                inline: true,
                                                items: [
                                                  {
                                                    props: {
                                                      label: "类型",
                                                      required: true
                                                    },
                                                    type: "select",
                                                    itemProps: {
                                                      prop: "type",
                                                      defaultValue: "",
                                                      filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
                                                      optionsPath: "NAME.type"
                                                    }
                                                  },
                                                  {
                                                    props: {
                                                      label: "国家地区",
                                                      required: true
                                                    },
                                                    type: "select",
                                                    itemProps: {
                                                      prop: "locale",
                                                      defaultValue: "",
                                                      displayOnly: true,
                                                      filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
                                                      optionsPath: "LOCALE"
                                                    }
                                                  }
                                                ]
                                              }
                                            },
                                            {
                                              nodeType: "y-pre-form",
                                              scopeMapping: {
                                                itemModel: "item",
                                                index: "index"
                                              },
                                              vIf: "{!locale.CHN.instanceId||!itemModel.locale||(locale.CHN.instanceId===itemModel.locale)}",
                                              scopeId: 2,
                                              props: {
                                                model: "{itemModel.nameCHN}",
                                                labelPosition: "top",
                                                span: 2,
                                                inline: true,
                                                items: [
                                                  {
                                                    type: "text",
                                                    props: {label: "中文姓"},
                                                    itemProps: {
                                                      prop: "primaryFamilyName",
                                                      defaultValue: ""
                                                    }
                                                  },
                                                  {
                                                    type: "text",
                                                    props: {label: "中文中间名"},
                                                    itemProps: {
                                                      prop: "primaryMiddleName",
                                                      defaultValue: ""
                                                    }
                                                  },
                                                  {
                                                    type: "text",
                                                    props: {label: "中文名"},
                                                    itemProps: {
                                                      prop: "primaryGivenName",
                                                      defaultValue: ""
                                                    }
                                                  },
                                                  {
                                                    type: "text",
                                                    props: {label: "第二姓名的姓"},
                                                    itemProps: {
                                                      prop: "secondaryFamilyName",
                                                      defaultValue: ""
                                                    }
                                                  },
                                                  {
                                                    type: "text",
                                                    props: {label: "第二姓名的中间名"},
                                                    itemProps: {
                                                      prop: "secondaryMiddleName",
                                                      defaultValue: ""
                                                    }
                                                  },
                                                  {
                                                    type: "text",
                                                    props: {label: "第二姓名的名"},
                                                    itemProps: {
                                                      prop: "secondaryGivenName",
                                                      defaultValue: ""
                                                    }
                                                  },
                                                  {
                                                    type: "text",
                                                    props: {label: "第三姓名的姓"},
                                                    itemProps: {
                                                      prop: "tertiaryFamilyName",
                                                      defaultValue: ""
                                                    }
                                                  },
                                                  {
                                                    type: "text",
                                                    props: {label: "第三姓名的中间名"},
                                                    itemProps: {
                                                      prop: "tertiaryMiddleName",
                                                      defaultValue: ""
                                                    }
                                                  },
                                                  {
                                                    type: "text",
                                                    props: {label: "第三姓名的名"},
                                                    itemProps: {
                                                      prop: "tertiaryGivenName",
                                                      defaultValue: ""
                                                    }
                                                  },
                                                  {
                                                    type: "text",
                                                    props: {label: "昵称"},
                                                    itemProps: {
                                                      prop: "nickName",
                                                      defaultValue: ""
                                                    }
                                                  },
                                                  {
                                                    type: "text",
                                                    props: {
                                                      label: "显示姓名",
                                                      required: true
                                                    },
                                                    itemProps: {
                                                      prop: "displayName",
                                                      defaultValue: ""
                                                    }
                                                  },
                                                  {
                                                    type: "text",
                                                    props: {label: "头衔"},
                                                    itemProps: {
                                                      prop: "title",
                                                      defaultValue: ""
                                                    }
                                                  }
                                                ]
                                              }
                                            }
                                          ]
                                        }
                                      }
                                    ]
                                  },
                                  //个人身份标识号
                                  {
                                    nodeType: "el-row",
                                    style: {margin: "20px 20px 0 20px"},
                                    children: [
                                      {
                                        nodeType: "el-col",
                                        children: [
                                          {
                                            nodeType: "el-card",
                                            props: {"body-style": {padding: "0"}},
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
                                                    innerHTML: "个人身份标识号"
                                                  },
                                                  {
                                                    nodeType: "i",
                                                    class: "el-icon-plus",
                                                    on: {
                                                      click: "{" +
                                                        "formData.personData.identifiers=formData.personData.identifiers||[];" +
                                                        "formData.personData.identifiers.push({})}"
                                                    }
                                                  }
                                                ]
                                              },
                                              {
                                                nodeType: "y-list",
                                                vIf: "{formData.personData.identifiers&&formData.personData.identifiers.length}",
                                                style: {padding: "10px 20px 30px 20px"},
                                                props: {forList: "{formData.personData.identifiers}"},
                                                scopedSlots: {
                                                  default: [
                                                    {
                                                      nodeType: "el-row",
                                                      scopeMapping: {
                                                        itemModel: "item",
                                                        index: "index"
                                                      },
                                                      props: {type: "flex"},
                                                      style: {
                                                        height: "30px",
                                                        "justify-content": "flex-end",
                                                        "align-items": "flex-end"
                                                      },
                                                      children: [
                                                        {
                                                          nodeType: "i",
                                                          class: "el-icon-delete",
                                                          on: {click: "{formData.personData.identifiers.splice(index,1)}"}
                                                        }]
                                                    },
                                                    {
                                                      nodeType: "y-pre-form",
                                                      scopeMapping: {itemModel: "item"},
                                                      props: {
                                                        model: "{itemModel}",
                                                        labelPosition: "top",
                                                        span: 2,
                                                        inline: true,
                                                        items: [
                                                          {
                                                            type: "select",
                                                            props: {
                                                              label: "国家地区",
                                                              required: true
                                                            },
                                                            itemProps: {
                                                              prop: "locale",
                                                              defaultValue: "",
                                                              filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
                                                              optionsPath: "LOCALE"
                                                            }
                                                          },
                                                          {
                                                            type: "select",
                                                            props: {
                                                              label: "类型",
                                                              required: true
                                                            },
                                                            itemProps: {
                                                              prop: "identificationType",
                                                              defaultValue: "",
                                                              filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
                                                              optionsPath: "IDENTIFIER.identificationType"
                                                            }
                                                          },
                                                          {
                                                            type: "text",
                                                            props: {
                                                              label: "证件号",
                                                              required: true
                                                            },
                                                            itemProps: {
                                                              prop: "identificationId",
                                                              defaultValue: ""
                                                            }
                                                          },
                                                          {
                                                            type: "date",
                                                            props: {label: "发证日期"},
                                                            itemProps: {
                                                              prop: "issuedDate",
                                                              defaultValue: ""
                                                            }
                                                          },
                                                          {
                                                            type: "date",
                                                            props: {label: "过期日期"},
                                                            itemProps: {
                                                              prop: "expirationDate",
                                                              defaultValue: ""
                                                            }
                                                          }]
                                                      }
                                                    }]
                                                }
                                              }
                                            
                                            ]
                                          }]
                                      }]
                                  },
                                  // 银行账号
                                  {
                                    nodeType: "el-row",
                                    style: {margin: "20px 20px 0 20px"},
                                    children: [
                                      {
                                        nodeType: "el-col",
                                        children: [
                                          {
                                            nodeType: "el-card",
                                            props: {"body-style": {padding: "0"}},
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
                                                    innerHTML: "银行账号"
                                                  },
                                                  {
                                                    nodeType: "i",
                                                    class: "el-icon-plus",
                                                    on: {
                                                      click: "{" +
                                                        "formData.personData.bankAccounts=formData.personData.bankAccounts||[];" +
                                                        "formData.personData.bankAccounts.push({})}"
                                                    }
                                                  }
                                                ]
                                              },
                                              {
                                                nodeType: "y-list",
                                                vIf: "{formData.personData.bankAccounts&&formData.personData.bankAccounts.length}",
                                                style: {padding: "10px 20px 30px 20px"},
                                                props: {forList: "{formData.personData.bankAccounts}"},
                                                scopedSlots: {
                                                  default: [
                                                    {
                                                      nodeType: "el-row",
                                                      scopeMapping: {
                                                        itemModel: "item",
                                                        index: "index"
                                                      },
                                                      props: {type: "flex"},
                                                      style: {
                                                        height: "30px",
                                                        "justify-content": "flex-end",
                                                        "align-items": "flex-end"
                                                      },
                                                      children: [
                                                        {
                                                          nodeType: "i",
                                                          class: "el-icon-delete",
                                                          on: {click: "{formData.personData.bankAccounts.splice(index,1)}"}
                                                        }]
                                                    },
                                                    {
                                                      nodeType: "y-pre-form",
                                                      scopeMapping: {itemModel: "item"},
                                                      props: {
                                                        model: "{itemModel}",
                                                        labelPosition: "top",
                                                        span: 2,
                                                        inline: true,
                                                        items: [
                                                          {
                                                            type: "select",
                                                            props: {
                                                              label: "国家地区",
                                                              required: true
                                                            },
                                                            itemProps: {
                                                              prop: "locale",
                                                              defaultValue: "",
                                                              filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
                                                              optionsPath: "LOCALE"
                                                            }
                                                          },
                                                          {
                                                            type: "select",
                                                            props: {
                                                              label: "类型",
                                                              required: true
                                                            },
                                                            itemProps: {
                                                              prop: "type",
                                                              defaultValue: "",
                                                              filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
                                                              optionsPath: "BANK_ACCOUNT.type"
                                                            }
                                                          },
                                                          {
                                                            type: "select",
                                                            props: {
                                                              label: "银行",
                                                              required: true
                                                            },
                                                            itemProps: {
                                                              prop: "bank",
                                                              defaultValue: "",
                                                              filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
                                                              optionsPath: "BANK"
                                                            }
                                                          },
                                                          {
                                                            type: "select",
                                                            props: {label: "支行"},
                                                            itemProps: {
                                                              prop: "bankBranch",
                                                              defaultValue: "",
                                                              filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
                                                              optionsPath: "BANK_BRANCH"
                                                            }
                                                          },
                                                          {
                                                            type: "text",
                                                            props: {
                                                              label: "账户名",
                                                              required: true
                                                            },
                                                            itemProps: {
                                                              prop: "accountName",
                                                              defaultValue: ""
                                                            }
                                                          },
                                                          {
                                                            type: "text",
                                                            props: {
                                                              label: "账户",
                                                              required: true
                                                            },
                                                            itemProps: {
                                                              prop: "accountNumber",
                                                              defaultValue: ""
                                                            }
                                                          }]
                                                      }
                                                    }]
                                                }
                                              }
                                            
                                            ]
                                          }]
                                      }]
                                  }
                                ]
                              },
                              {
                                nodeType: "el-card",
                                slot: "steps",
                                style: {margin: "20px 0"},
                                children: [
                                  {
                                    nodeType: "el-steps",
                                    props: {
                                      direction: "vertical",
                                      space: "100px",
                                      active: "{activeConfig.activeIndex}"
                                    },
                                    children: [
                                      {
                                        nodeType: "el-step",
                                        props: {title: "个人信息"}
                                      },
                                      {
                                        nodeType: "el-step",
                                        props: {title: "联系信息"}
                                      },
                                      {
                                        nodeType: "el-step",
                                        props: {title: "雇佣信息"}
                                      },
                                      {
                                        nodeType: "el-step",
                                        props: {title: "工作信息"}
                                      },
                                      {
                                        nodeType: "el-step",
                                        props: {title: "薪酬信息"}
                                      }
                                    ]
                                  }]
                              }
                            
                            ]
                          }
                        ]
                      }]
                  }]
              },
              {
                nodeType: "el-carousel-item",
                props: {name: "carouselItem1"},
                children: [
                  {
                    nodeType: "el-scrollbar",
                    children: [
                      {
                        nodeType: "ySteps",
                        props: {stepPosition: "right"},
                        children: [
                          {
                            nodeType: "el-container",
                            props: {"direction": "vertical"},
                            children: [
                              {
                                nodeType: "el-row",
                                style: {margin: "20px 20px 0 20px"},
                                children: [
                                  {
                                    nodeType: "el-col",
                                    children: [
                                      {
                                        nodeType: "el-card",
                                        props: {"body-style": {padding: "0"}},
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
                                                innerHTML: "地址"
                                              },
                                              {
                                                nodeType: "i",
                                                scopeId: 2,
                                                class: "el-icon-plus",
                                                on: {
                                                  click: "{" +
                                                    "formData.personData.addresses=formData.personData.addresses||[];" +
                                                    "formData.personData.addresses.push({addressCHN:{},locale:locale.CHN.instanceId})}"
                                                }
                                              }
                                            ]
                                          },
                                          {
                                            nodeType: "y-list",
                                            style: {padding: "10px 20px 30px 20px"},
                                            vIf: "{formData.personData.addresses&&formData.personData.addresses.length}",
                                            props: {forList: "{formData.personData.addresses}"},
                                            scopedSlots: {
                                              default: [
                                                {
                                                  nodeType: "el-row",
                                                  scopeMapping: {
                                                    itemModel: "item",
                                                    index: "index"
                                                  },
                                                  scopeId: 2,
                                                  props: {type: "flex"},
                                                  style: {
                                                    height: "30px",
                                                    "justify-content": "flex-end",
                                                    "align-items": "flex-end"
                                                  },
                                                  children: [
                                                    {
                                                      nodeType: "i",
                                                      class: "el-icon-delete",
                                                      on: {click: "{formData.personData.addresses.splice(index,1)}"}
                                                    }]
                                                },
                                                {
                                                  nodeType: "y-pre-form",
                                                  scopeMapping: {
                                                    itemModel: "item",
                                                    index: "index"
                                                  },
                                                  scopeId: 2,
                                                  props: {
                                                    model: "{itemModel}",
                                                    labelPosition: "top",
                                                    span: 2,
                                                    inline: true,
                                                    items: [
                                                      {
                                                        type: "select",
                                                        props: {
                                                          label: "类型",
                                                          required: true
                                                        },
                                                        itemProps: {
                                                          prop: "type",
                                                          defaultValue: "",
                                                          filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
                                                          optionsPath: "ADDRESS.type"
                                                        }
                                                      },
                                                      {
                                                        type: "select",
                                                        props: {
                                                          label: "国家地区",
                                                          required: true
                                                        },
                                                        itemProps: {
                                                          prop: "locale",
                                                          defaultValue: "",
                                                          displayOnly: true,
                                                          filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
                                                          optionsPath: "LOCALE"
                                                        }
                                                      }]
                                                  }
                                                },
                                                {
                                                  nodeType: "y-pre-form",
                                                  scopeMapping: {
                                                    itemModel: "item",
                                                    index: "index"
                                                  },
                                                  vIf: "{!locale.CHN.instanceId||!itemModel.locale||(locale.CHN.instanceId===itemModel.locale)}",
                                                  scopeId: 2,
                                                  props: {
                                                    model: "{itemModel}",
                                                    labelPosition: "top",
                                                    span: 2,
                                                    inline: true,
                                                    items: [
                                                      {
                                                        type: "select",
                                                        props: {label: "省市"},
                                                        itemProps: {
                                                          defaultValue: "",
                                                          prop: "addressCHN.region",
                                                          filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
                                                          optionsPath: "REGION_CHN"
                                                        }
                                                      },
                                                      {
                                                        type: "select",
                                                        props: {label: "城市"},
                                                        itemProps: {
                                                          defaultValue: "",
                                                          prop: "addressCHN.city",
                                                          filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
                                                          optionsPath: "CITY_CHN"
                                                        }
                                                      },
                                                      {
                                                        type: "select",
                                                        props: {label: "地区"},
                                                        itemProps: {
                                                          defaultValue: "",
                                                          prop: "addressCHN.district",
                                                          filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
                                                          optionsPath: "DISTRICT_CHN"
                                                        }
                                                      },
                                                      {
                                                        type: "select",
                                                        props: {label: "子地区"},
                                                        itemProps: {
                                                          defaultValue: "",
                                                          prop: "addressCHN.subDistrict",
                                                          filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
                                                          optionsPath: "SUBDISTRICT_CHN"
                                                        }
                                                      },
                                                      {
                                                        type: "text",
                                                        props: {label: "地址"},
                                                        itemProps: {
                                                          defaultValue: "",
                                                          prop: "addressCHN.address1"
                                                        }
                                                      },
                                                      {
                                                        type: "text",
                                                        props: {label: "邮政"},
                                                        itemProps: {
                                                          defaultValue: "",
                                                          prop: "addressCHN.postal"
                                                        }
                                                      }
                                                    ]
                                                  }
                                                }
                                              ]
                                            }
                                          }
                                        ]
                                      }]
                                  }]
                              },
                              //电话
                              {
                                nodeType: "el-row",
                                style: {margin: "20px 20px 0 20px"},
                                children: [
                                  {
                                    nodeType: "el-col",
                                    children: [
                                      {
                                        nodeType: "el-card",
                                        props: {"body-style": {padding: "0"}},
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
                                                innerHTML: "电话"
                                              },
                                              {
                                                nodeType: "i",
                                                class: "el-icon-plus",
                                                on: {
                                                  click: "{" +
                                                    "formData.personData.phones=formData.personData.phones||[];" +
                                                    "formData.personData.phones.push({})}"
                                                }
                                              }
                                            ]
                                          },
                                          {
                                            nodeType: "y-list",
                                            style: {padding: "10px 20px 30px 20px"},
                                            vIf: "{formData.personData.phones&&formData.personData.phones.length}",
                                            props: {forList: "{formData.personData.phones}"},
                                            scopedSlots: {
                                              default: [
                                                {
                                                  nodeType: "el-row",
                                                  scopeMapping: {
                                                    itemModel: "item",
                                                    index: "index"
                                                  },
                                                  props: {type: "flex"},
                                                  style: {
                                                    height: "30px",
                                                    "justify-content": "flex-end",
                                                    "align-items": "flex-end"
                                                    
                                                  },
                                                  children: [
                                                    {
                                                      nodeType: "i",
                                                      class: "el-icon-delete",
                                                      on: {click: "{formData.personData.phones.splice(index,1)}"}
                                                    }]
                                                },
                                                {
                                                  nodeType: "y-pre-form",
                                                  scopeMapping: {itemModel: "item"},
                                                  props: {
                                                    model: "{itemModel}",
                                                    labelPosition: "top",
                                                    span: 2,
                                                    inline: true,
                                                    items: [
                                                      {
                                                        type: "select",
                                                        props: {
                                                          label: "类型",
                                                          required: true
                                                        },
                                                        itemProps: {
                                                          defaultValue: "",
                                                          prop: "type",
                                                          filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
                                                          optionsPath: "PHONE.type"
                                                        }
                                                      },
                                                      {
                                                        type: "select",
                                                        props: {
                                                          label: "国家地区",
                                                          required: true
                                                        },
                                                        itemProps: {
                                                          defaultValue: "",
                                                          prop: "locale",
                                                          filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
                                                          optionsPath: "LOCALE"
                                                        }
                                                      },
                                                      {
                                                        type: "text",
                                                        props: {label: "国际冠码"},
                                                        itemProps: {
                                                          defaultValue: "",
                                                          prop: "interPrefix"
                                                        }
                                                      },
                                                      {
                                                        type: "text",
                                                        props: {label: "长途字冠"},
                                                        itemProps: {
                                                          defaultValue: "",
                                                          prop: "trunkPrefix"
                                                        }
                                                      },
                                                      {
                                                        type: "text",
                                                        props: {
                                                          label: "号码",
                                                          required: true
                                                        },
                                                        itemProps: {
                                                          defaultValue: "",
                                                          prop: "phoneNumber"
                                                        }
                                                      },
                                                      {
                                                        type: "text",
                                                        props: {label: "分机"},
                                                        itemProps: {
                                                          defaultValue: "",
                                                          prop: "extension"
                                                        }
                                                      }]
                                                  }
                                                }
                                              ]
                                            }
                                          }]
                                      }]
                                  }]
                              },
                              //邮箱
                              {
                                nodeType: "el-row",
                                style: {margin: "20px 20px 0 20px"},
                                children: [
                                  {
                                    nodeType: "el-col",
                                    children: [
                                      {
                                        nodeType: "el-card",
                                        props: {"body-style": {padding: "0"}},
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
                                                innerHTML: "邮箱"
                                              },
                                              {
                                                nodeType: "i",
                                                class: "el-icon-plus",
                                                on: {
                                                  click: "{" +
                                                    "formData.personData.emails=formData.personData.emails||[];" +
                                                    "formData.personData.emails.push({})}"
                                                }
                                              }
                                            ]
                                          },
                                          {
                                            nodeType: "y-list",
                                            style: {padding: "10px 20px 30px 20px"},
                                            vIf: "{formData.personData.emails&&formData.personData.emails.length}",
                                            props: {forList: "{formData.personData.emails}"},
                                            scopedSlots: {
                                              default: [
                                                {
                                                  nodeType: "el-row",
                                                  scopeMapping: {
                                                    itemModel: "item",
                                                    index: "index"
                                                  },
                                                  props: {type: "flex"},
                                                  style: {
                                                    height: "30px",
                                                    "justify-content": "flex-end",
                                                    "align-items": "flex-end"
                                                  },
                                                  children: [
                                                    {
                                                      nodeType: "i",
                                                      class: "el-icon-delete",
                                                      on: {click: "{formData.personData.emails.splice(index,1)}"}
                                                    }]
                                                },
                                                {
                                                  nodeType: "y-pre-form",
                                                  scopeMapping: {itemModel: "item"},
                                                  props: {
                                                    model: "{itemModel}",
                                                    labelPosition: "top",
                                                    span: 2,
                                                    inline: true,
                                                    items: [
                                                      {
                                                        type: "select",
                                                        props: {
                                                          label: "类型",
                                                          required: true
                                                        },
                                                        itemProps: {
                                                          defaultValue: "",
                                                          prop: "type",
                                                          filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
                                                          optionsPath: "EMAIL.type"
                                                        }
                                                      },
                                                      {
                                                        type: "text",
                                                        props: {
                                                          label: "邮箱",
                                                          required: true
                                                        },
                                                        itemProps: {
                                                          defaultValue: "",
                                                          prop: "email"
                                                        }
                                                      }]
                                                  }
                                                }]
                                            }
                                          }]
                                      }]
                                  }]
                              },
                              {
                                nodeType: "el-row",
                                style: {margin: "20px 20px 0 20px"},
                                children: [
                                  {
                                    nodeType: "el-col",
                                    children: [
                                      {
                                        nodeType: "el-card",
                                        props: {"body-style": {padding: "0"}},
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
                                                innerHTML: "其他联系方式"
                                              },
                                              {
                                                nodeType: "i",
                                                class: "el-icon-plus",
                                                on: {
                                                  click: "{" +
                                                    "formData.personData.otherContacts=formData.personData.otherContacts||[];" +
                                                    "formData.personData.otherContacts.push({})}"
                                                }
                                              }]
                                          },
                                          {
                                            nodeType: "y-list",
                                            style: {padding: "10px 20px 30px 20px"},
                                            vIf: "{formData.personData.otherContacts&&formData.personData.otherContacts.length}",
                                            props: {forList: "{formData.personData.otherContacts}"},
                                            scopedSlots: {
                                              default: [
                                                {
                                                  nodeType: "el-row",
                                                  scopeMapping: {
                                                    itemModel: "item",
                                                    index: "index"
                                                  },
                                                  props: {type: "flex"},
                                                  style: {
                                                    height: "30px",
                                                    "justify-content": "flex-end",
                                                    "align-items": "flex-end"
                                                  },
                                                  children: [
                                                    {
                                                      nodeType: "i",
                                                      class: "el-icon-delete",
                                                      on: {click: "{formData.personData.otherContacts.splice(index,1)}"}
                                                    }]
                                                },
                                                {
                                                  nodeType: "y-pre-form",
                                                  scopeMapping: {itemModel: "item"},
                                                  props: {
                                                    model: "{itemModel}",
                                                    labelPosition: "top",
                                                    span: 2,
                                                    inline: true,
                                                    items: [
                                                      {
                                                        type: "select",
                                                        props: {
                                                          label: "类型",
                                                          required: true
                                                        },
                                                        itemProps: {
                                                          defaultValue: "",
                                                          prop: "otherContactType",
                                                          filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
                                                          optionsPath: "OTHER_CONTACT.otherContactType"
                                                        }
                                                      },
                                                      {
                                                        type: "text",
                                                        props: {
                                                          label: "其他联系方式ID",
                                                          required: true
                                                        },
                                                        itemProps: {
                                                          defaultValue: "",
                                                          prop: "otherContactId"
                                                        }
                                                      }
                                                    ]
                                                  }
                                                }]
                                            }
                                          }]
                                      }]
                                  }]
                              }
                            ]
                          },
                          {
                            nodeType: "el-card",
                            slot: "steps",
                            style: {margin: "20px 0"},
                            children: [
                              {
                                nodeType: "el-steps",
                                props: {
                                  direction: "vertical",
                                  space: "100px",
                                  active: "{activeConfig.activeIndex}"
                                },
                                children: [
                                  {
                                    nodeType: "el-step",
                                    props: {title: "个人信息"}
                                  },
                                  {
                                    nodeType: "el-step",
                                    props: {title: "联系信息"}
                                  },
                                  {
                                    nodeType: "el-step",
                                    props: {title: "雇佣信息"}
                                  },
                                  {
                                    nodeType: "el-step",
                                    props: {title: "工作信息"}
                                  },
                                  {
                                    nodeType: "el-step",
                                    props: {title: "薪酬信息"}
                                  }
                                ]
                              }]
                          }
                        ]
                      }
                    ]
                  }]
              },
              {
                nodeType: "el-carousel-item",
                props: {name: "carouselItem2"},
                children: [
                  {
                    nodeType: "el-scrollbar",
                    children: [
                      {
                        nodeType: "ySteps",
                        props: {stepPosition: "right"},
                        children: [
                          {
                            nodeType: "el-container",
                            props: {"direction": "vertical"},
                            children: [
                              //雇佣信息
                              {
                                nodeType: "el-row",
                                style: {margin: "20px 20px 0 20px"},
                                children: [
                                  {
                                    nodeType: "el-col",
                                    children: [
                                      {
                                        nodeType: "el-card",
                                        props: {"body-style": {"padding": "0"}},
                                        children: [
                                          {
                                            nodeType: "el-row",
                                            slot: "header",
                                            props: {type: "flex"},
                                            children: [
                                              {
                                                nodeType: "div",
                                                style: {flex: "auto"},
                                                class: "required",
                                                innerHTML: "雇佣信息"
                                              }]
                                          },
                                          {
                                            nodeType: "y-pre-form",
                                            style: {padding: "40px 20px 30px 20px"},
                                            props: {
                                              model: "{formData.employeeData.employment}",
                                              labelPosition: "top",
                                              span: 2,
                                              inline: true,
                                              items: [
                                                {
                                                  type: "text",
                                                  props: {label: "雇佣工号"},
                                                  itemProps: {
                                                    defaultValue: "",
                                                    prop: "employeeId"
                                                  }
                                                },
                                                {
                                                  type: "select",
                                                  props: {
                                                    label: "雇佣类型",
                                                    required: true
                                                  },
                                                  itemProps: {
                                                    defaultValue: "",
                                                    prop: "employmentType",
                                                    filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
                                                    optionsPath: "EMPLOYMENT.employmentType"
                                                  }
                                                }
                                                // {
                                                //   type: "select", props: {label: "雇佣状态", required: true},
                                                //   itemProps: {defaultValue: "", prop: "employmentStatus", optionsPath: "EMPLOYMENT.employmentStatus"}
                                                // }
                                              ]
                                            }
                                          }]
                                      }]
                                  }]
                              },
                              //劳动关系
                              {
                                nodeType: "el-row",
                                style: {margin: "20px 20px 0 20px"},
                                children: [
                                  {
                                    nodeType: "el-col",
                                    children: [
                                      {
                                        nodeType: "el-card",
                                        props: {"body-style": {padding: "0"}},
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
                                              }/*,
                                               {
                                               nodeType: "i",
                                               class: "el-icon-plus",
                                               on: {
                                               click: "{" +
                                               "formData.employeeData.workRelationships=formData.employeeData.workRelationships||[];" +
                                               "formData.employeeData.workRelationships.push({workRelationshipStatus:\"ACTIVE\"})}"
                                               }
                                               }*/]
                                          },
                                          {
                                            nodeType: "y-list",
                                            style: {padding: "10px 20px 30px 20px"},
                                            vIf: "{formData.employeeData.workRelationships&&formData.employeeData.workRelationships.length}",
                                            props: {forList: "{formData.employeeData.workRelationships}"},
                                            scopedSlots: {
                                              default: [
                                                /*{
                                                 nodeType: "el-row",
                                                 scopeMapping: {
                                                 itemModel: "item",
                                                 index: "index"
                                                 },
                                                 props: {type: "flex"},
                                                 style: {
                                                 height: "30px",
                                                 "justify-content": "flex-end",
                                                 "align-items": "flex-end"
                                                 },
                                                 children: [
                                                 {
                                                 nodeType: "i",
                                                 class: "el-icon-delete",
                                                 on: {click: "{formData.employeeData.workRelationships.splice(index,1)}"}
                                                 }]
                                                 },*/
                                                {
                                                  nodeType: "y-pre-form",
                                                  scopeMapping: {itemModel: "item"},
                                                  props: {
                                                    model: "{itemModel}",
                                                    labelPosition: "top",
                                                    span: 2,
                                                    inline: true,
                                                    items: [
                                                      {
                                                        type: "select",
                                                        props: {
                                                          label: "分配类型",
                                                          required: true
                                                        },
                                                        itemProps: {
                                                          defaultValue: "",
                                                          prop: "assignmentType",
                                                          filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
                                                          optionsPath: "WORK_RELATIONSHIPS.assignmentType"
                                                        }
                                                      },
                                                      {
                                                        type: "text",
                                                        props: {label: "劳动关系ID"},
                                                        itemProps: {
                                                          defaultValue: "",
                                                          prop: "workRelationshipId"
                                                        }
                                                      },
                                                      {
                                                        type: "select",
                                                        props: {
                                                          label: "劳动关系类型",
                                                          required: true
                                                        },
                                                        itemProps: {
                                                          defaultValue: "",
                                                          prop: "workRelationshipType",
                                                          filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
                                                          optionsPath: "WORK_RELATIONSHIPS.workRelationshipType"
                                                        }
                                                      },
                                                      // {
                                                      //   type: "select", props: {label: "劳动关系状态", required: true},
                                                      //   itemProps: {defaultValue: "", prop: "workRelationshipStatus", optionsPath:
                                                      // "WORK_RELATIONSHIPS.workRelationshipStatus"} },
                                                      {
                                                        type: "date",
                                                        props: {label: "入职日期"},
                                                        itemProps: {
                                                          defaultValue: "",
                                                          prop: "hireDate"
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
                              //劳动合同
                              {
                                nodeType: "el-row",
                                style: {margin: "20px 20px 0 20px"},
                                children: [
                                  {
                                    nodeType: "el-col",
                                    children: [
                                      {
                                        nodeType: "el-card",
                                        props: {"body-style": {padding: "0"}},
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
                                                innerHTML: "劳动合同"
                                              }
                                              // {
                                              //   nodeType: "i",
                                              //   class: "el-icon-plus",
                                              //   on: {
                                              //     click: "{" +
                                              //       "formData.employeeData.contracts=formData.employeeData.contracts||[];" +
                                              //       "formData.employeeData.contracts.push({})}"
                                              //   }
                                              // }
                                            ]
                                          },
                                          {
                                            nodeType: "y-list",
                                            style: {padding: "10px 20px 30px 20px"},
                                            vIf: "{formData.employeeData.contracts&&formData.employeeData.contracts.length}",
                                            props: {forList: "{formData.employeeData.contracts}"},
                                            scopedSlots: {
                                              default: [
                                                // {
                                                //   nodeType: "el-row",
                                                //   scopeMapping: {
                                                //     itemModel: "item",
                                                //     index: "index"
                                                //   },
                                                //   props: {type: "flex"},
                                                //   style: {
                                                //     height: "30px",
                                                //     "justify-content": "flex-end",
                                                //     "align-items": "flex-end"
                                                //   },
                                                //   children: [
                                                //     {
                                                //       nodeType: "i",
                                                //       class: "el-icon-delete",
                                                //       on: {click: "{formData.employeeData.contracts.splice(index,1)}"}
                                                //     }]
                                                // },
                                                {
                                                  nodeType: "y-pre-form",
                                                  scopeMapping: {itemModel: "item"},
                                                  props: {
                                                    model: "{itemModel}",
                                                    labelPosition: "top",
                                                    span: 2,
                                                    inline: true,
                                                    items: [
                                                      {
                                                        type: "select",
                                                        props: {
                                                          label: "类型",
                                                          required: true
                                                        },
                                                        itemProps: {
                                                          defaultValue: "",
                                                          prop: "type",
                                                          filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
                                                          optionsPath: "CONTRACTS.type"
                                                        }
                                                      },
                                                      {
                                                        type: "date",
                                                        props: {
                                                          label: "开始日期",
                                                          required: true
                                                        },
                                                        itemProps: {
                                                          defaultValue: "",
                                                          prop: "startDate"
                                                        }
                                                      },
                                                      {
                                                        type: "date",
                                                        props: {label: "结束日期"},
                                                        itemProps: {
                                                          defaultValue: "",
                                                          prop: "endDate"
                                                        }
                                                      }
                                                    ]
                                                  }
                                                }]
                                            }
                                          }]
                                      }]
                                  }]
                              }
                            ]
                          },
                          {
                            nodeType: "el-card",
                            slot: "steps",
                            style: {margin: "20px 0"},
                            children: [
                              {
                                nodeType: "el-steps",
                                props: {
                                  direction: "vertical",
                                  space: "100px",
                                  active: "{activeConfig.activeIndex}"
                                },
                                children: [
                                  {
                                    nodeType: "el-step",
                                    props: {title: "个人信息"}
                                  },
                                  {
                                    nodeType: "el-step",
                                    props: {title: "联系信息"}
                                  },
                                  {
                                    nodeType: "el-step",
                                    props: {title: "雇佣信息"}
                                  },
                                  {
                                    nodeType: "el-step",
                                    props: {title: "工作信息"}
                                  },
                                  {
                                    nodeType: "el-step",
                                    props: {title: "薪酬信息"}
                                  }
                                ]
                              }]
                          }
                        ]
                      }
                    ]
                  }]
              },
              {
                nodeType: "el-carousel-item",
                props: {name: "carouselItem3"},
                children: [
                  {
                    nodeType: "el-scrollbar",
                    children: [
                      {
                        nodeType: "ySteps",
                        props: {stepPosition: "right"},
                        children: [
                          {
                            nodeType: "el-container",
                            props: {"direction": "vertical"},
                            children: [
                              //职位
                              {
                                nodeType: "el-row",
                                style: {margin: "20px 20px 0 20px"},
                                children: [
                                  {
                                    nodeType: "el-col",
                                    children: [
                                      {
                                        nodeType: "el-card",
                                        props: {"body-style": {padding: "0"}},
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
                                                innerHTML: "职位"
                                              }
                                              // {
                                              //   nodeType: "i",
                                              //   class: "el-icon-plus",
                                              //   on: {
                                              //     click: "{formData.employeeData.positions=formData.employeeData.positions||[];" +
                                              //       "formData.employeeData.positions.push({})}"
                                              //   }
                                              // }
                                            ]
                                          },
                                          {
                                            nodeType: "y-list",
                                            style: {padding: "10px 20px 30px 20px"},
                                            vIf: "{formData.employeeData.positions&&formData.employeeData.positions.length}",
                                            props: {forList: "{formData.employeeData.positions}"},
                                            scopedSlots: {
                                              default: [
                                                // {
                                                //   nodeType: "el-row",
                                                //   scopeMapping: {
                                                //     itemModel: "item",
                                                //     index: "index"
                                                //   },
                                                //   props: {type: "flex"},
                                                //   style: {
                                                //     height: "30px",
                                                //     "justify-content": "flex-end",
                                                //     "align-items": "flex-end"
                                                //   },
                                                //   children: [
                                                //     {
                                                //       nodeType: "i",
                                                //       class: "el-icon-delete",
                                                //       on: {click: "{formData.employeeData.positions.splice(index,1)}"}
                                                //     }]
                                                // },
                                                {
                                                  nodeType: "y-pre-form",
                                                  scopeMapping: {itemModel: "item"},
                                                  props: {
                                                    model: "{itemModel}",
                                                    labelPosition: "top",
                                                    span: 2,
                                                    inline: true,
                                                    items: [
                                                      {
                                                        type: "select",
                                                        props: {
                                                          label: "分配类型",
                                                          required: true
                                                        },
                                                        itemProps: {
                                                          defaultValue: "",
                                                          prop: "assignmentType",
                                                          filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
                                                          optionsPath: "POSITIONS.assignmentType"
                                                        }
                                                      },
                                                      {
                                                        type: "select",
                                                        props: {
                                                          label: "职位",
                                                          required: true
                                                        },
                                                        itemProps: {
                                                          defaultValue: "",
                                                          prop: "position",
                                                          filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
                                                          optionsPath: "POSITION"
                                                        }
                                                      }]
                                                  }
                                                }]
                                            }
                                          }]
                                      }]
                                  }]
                              },
                              // 职务
                              {
                                nodeType: "el-row",
                                style: {margin: "20px 20px 0 20px"},
                                children: [
                                  {
                                    nodeType: "el-col",
                                    children: [
                                      {
                                        nodeType: "el-card",
                                        props: {"body-style": {padding: "0"}},
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
                                                innerHTML: "职务"
                                              }
                                              // {
                                              //   nodeType: "i",
                                              //   class: "el-icon-plus",
                                              //   on: {
                                              //     click: "{" +
                                              //       "formData.employeeData.jobs=formData.employeeData.jobs||[];" +
                                              //       "formData.employeeData.jobs.push({})}"
                                              //   }
                                              // }
                                            ]
                                          },
                                          {
                                            nodeType: "y-list",
                                            style: {padding: "10px 20px 30px 20px"},
                                            vIf: "{formData.employeeData.jobs&&formData.employeeData.jobs.length}",
                                            props: {forList: "{formData.employeeData.jobs}"},
                                            scopedSlots: {
                                              default: [
                                                // {
                                                //   nodeType: "el-row",
                                                //   scopeMapping: {
                                                //     itemModel: "item",
                                                //     index: "index"
                                                //   },
                                                //   props: {type: "flex"},
                                                //   style: {
                                                //     height: "30px",
                                                //     "justify-content": "flex-end",
                                                //     "align-items": "flex-end"
                                                //   },
                                                //   children: [
                                                //     {
                                                //       nodeType: "i",
                                                //       class: "el-icon-delete",
                                                //       on: {click: "{formData.employeeData.jobs.splice(index,1)}"}
                                                //     }]
                                                // },
                                                {
                                                  nodeType: "y-pre-form",
                                                  scopeMapping: {itemModel: "item"},
                                                  props: {
                                                    model: "{itemModel}",
                                                    labelPosition: "top",
                                                    span: 2,
                                                    inline: true,
                                                    items: [
                                                      {
                                                        type: "select",
                                                        props: {
                                                          label: "分配类型",
                                                          required: true
                                                        },
                                                        itemProps: {
                                                          defaultValue: "",
                                                          prop: "assignmentType",
                                                          filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
                                                          optionsPath: "JOBS.assignmentType"
                                                        }
                                                      },
                                                      {
                                                        type: "select",
                                                        props: {
                                                          label: "职务",
                                                          required: true
                                                        },
                                                        itemProps: {
                                                          defaultValue: "",
                                                          prop: "job",
                                                          filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
                                                          optionsPath: "JOB"
                                                        }
                                                      }]
                                                  }
                                                }]
                                            }
                                          }]
                                      }]
                                  }]
                              },
                              // 职级
                              {
                                nodeType: "el-row",
                                style: {margin: "20px 20px 0 20px"},
                                children: [
                                  {
                                    nodeType: "el-col",
                                    children: [
                                      {
                                        nodeType: "el-card",
                                        props: {"body-style": {padding: "0"}},
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
                                                innerHTML: "职级"
                                              }
                                              // {
                                              //   nodeType: "i",
                                              //   class: "el-icon-plus",
                                              //   on: {
                                              //     click: "{formData.employeeData.managementLevels=formData.employeeData.managementLevels||[];" +
                                              //       "formData.employeeData.managementLevels.push({})}"
                                              //   }
                                              // }
                                            ]
                                          },
                                          {
                                            nodeType: "y-list",
                                            style: {padding: "10px 20px 30px 20px"},
                                            vIf: "{formData.employeeData.managementLevels&&formData.employeeData.managementLevels.length}",
                                            props: {forList: "{formData.employeeData.managementLevels}"},
                                            scopedSlots: {
                                              default: [
                                                // {
                                                //   nodeType: "el-row",
                                                //   scopeMapping: {
                                                //     itemModel: "item",
                                                //     index: "index"
                                                //   },
                                                //   props: {type: "flex"},
                                                //   style: {
                                                //     height: "30px",
                                                //     "justify-content": "flex-end",
                                                //     "align-items": "flex-end"
                                                //   },
                                                //   children: [
                                                //     {
                                                //       nodeType: "i",
                                                //       class: "el-icon-delete",
                                                //       on: {click: "{formData.employeeData.managementLevels.splice(index,1)}"}
                                                //     }]
                                                // },
                                                {
                                                  nodeType: "y-pre-form",
                                                  scopeMapping: {itemModel: "item"},
                                                  props: {
                                                    model: "{itemModel}",
                                                    labelPosition: "top",
                                                    span: 2,
                                                    inline: true,
                                                    items: [
                                                      {
                                                        type: "select",
                                                        props: {
                                                          label: "分配类型",
                                                          required: true
                                                        },
                                                        itemProps: {
                                                          defaultValue: "",
                                                          prop: "assignmentType",
                                                          filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
                                                          optionsPath: "MANAGEMENT_LEVELS.assignmentType"
                                                        }
                                                      },
                                                      {
                                                        type: "select",
                                                        props: {
                                                          label: "职级",
                                                          required: true
                                                        },
                                                        itemProps: {
                                                          defaultValue: "",
                                                          prop: "managementLevel",
                                                          filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
                                                          optionsPath: "MANAGEMENT_LEVEL"
                                                        }
                                                      }]
                                                  }
                                                }]
                                            }
                                          }]
                                      }]
                                  }]
                              },
                              // 组织信息
                              {
                                nodeType: "el-row",
                                style: {margin: "20px 20px 0 20px"},
                                children: [
                                  {
                                    nodeType: "el-col",
                                    children: [
                                      {
                                        nodeType: "el-card",
                                        props: {"body-style": {padding: "0"}},
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
                                                innerHTML: "组织信息"
                                              }
                                              // {
                                              //   nodeType: "i",
                                              //   class: "el-icon-plus",
                                              //   on: {
                                              //     click: "{" +
                                              //       "formData.employeeData.organizations=formData.employeeData.organizations||[];" +
                                              //       "formData.employeeData.organizations.push({})}"
                                              //   }
                                              // }
                                            ]
                                          },
                                          {
                                            nodeType: "y-list",
                                            style: {padding: "10px 20px 30px 20px"},
                                            vIf: "{formData.employeeData.organizations&&formData.employeeData.organizations.length}",
                                            props: {forList: "{formData.employeeData.organizations}"},
                                            scopedSlots: {
                                              default: [
                                                // {
                                                //   nodeType: "el-row",
                                                //   scopeMapping: {
                                                //     itemModel: "item",
                                                //     index: "index"
                                                //   },
                                                //   props: {type: "flex"},
                                                //   style: {
                                                //     height: "30px",
                                                //     "justify-content": "flex-end",
                                                //     "align-items": "flex-end"
                                                //   },
                                                //   children: [
                                                //     {
                                                //       nodeType: "i",
                                                //       class: "el-icon-delete",
                                                //       on: {click: "{formData.employeeData.organizations.splice(index,1)}"}
                                                //     }]
                                                // },
                                                {
                                                  nodeType: "y-pre-form",
                                                  scopeMapping: {itemModel: "item"},
                                                  props: {
                                                    model: "{itemModel}",
                                                    labelPosition: "top",
                                                    span: 2,
                                                    inline: true,
                                                    items: [
                                                      {
                                                        type: "select",
                                                        props: {
                                                          label: "组织类型",
                                                          required: true
                                                        },
                                                        itemProps: {
                                                          defaultValue: "",
                                                          prop: "type",
                                                          filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
                                                          optionsPath: "ORGANIZATIONS.type"
                                                        }
                                                      },
                                                      {
                                                        type: "select",
                                                        props: {
                                                          label: "分配类型",
                                                          required: true
                                                        },
                                                        itemProps: {
                                                          defaultValue: "",
                                                          prop: "assignmentType",
                                                          filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
                                                          optionsPath: "ORGANIZATIONS.assignmentType"
                                                        }
                                                      },
                                                      {
                                                        type: "select",
                                                        props: {
                                                          label: "组织",
                                                          required: true
                                                        },
                                                        itemProps: {
                                                          defaultValue: "",
                                                          prop: "organization",
                                                          optionsPath: "ORGANIZATION",
                                                          filter: {
                                                            params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"},
                                                            data: {type: "{itemModel.type}"}
                                                          }
                                                        }
                                                      }]
                                                  }
                                                }]
                                            }
                                          }]
                                      }]
                                  }]
                              },
                              // 汇报关系
                              {
                                nodeType: "el-row",
                                style: {margin: "20px 20px 0 20px"},
                                children: [
                                  {
                                    nodeType: "el-col",
                                    children: [
                                      {
                                        nodeType: "el-card",
                                        props: {"body-style": {padding: "0"}},
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
                                                innerHTML: "汇报关系"
                                              },
                                              {
                                                nodeType: "i",
                                                class: "el-icon-plus",
                                                on: {
                                                  click: "{" +
                                                    "formData.employeeData.managers=formData.employeeData.managers||[];" +
                                                    "formData.employeeData.managers.push({})}"
                                                }
                                              }]
                                          },
                                          {
                                            nodeType: "y-list",
                                            style: {padding: "10px 20px 30px 20px"},
                                            vIf: "{formData.employeeData.managers&&formData.employeeData.managers.length}",
                                            props: {forList: "{formData.employeeData.managers}"},
                                            scopedSlots: {
                                              default: [
                                                {
                                                  nodeType: "el-row",
                                                  scopeMapping: {
                                                    itemModel: "item",
                                                    index: "index"
                                                  },
                                                  props: {type: "flex"},
                                                  style: {
                                                    height: "30px",
                                                    "justify-content": "flex-end",
                                                    "align-items": "flex-end"
                                                  },
                                                  children: [
                                                    {
                                                      nodeType: "i",
                                                      class: "el-icon-delete",
                                                      on: {click: "{formData.employeeData.managers.splice(index,1)}"}
                                                    }]
                                                },
                                                {
                                                  nodeType: "y-pre-form",
                                                  scopeMapping: {itemModel: "item"},
                                                  props: {
                                                    model: "{itemModel}",
                                                    labelPosition: "top",
                                                    span: 2,
                                                    inline: true,
                                                    items: [
                                                      {
                                                        type: "select",
                                                        props: {
                                                          label: "类型",
                                                          required: true
                                                        },
                                                        itemProps: {
                                                          defaultValue: "",
                                                          prop: "type",
                                                          filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
                                                          optionsPath: "MANAGERS.type"
                                                        }
                                                      },
                                                      {
                                                        type: "select",
                                                        props: {
                                                          label: "主管",
                                                          required: true
                                                        },
                                                        itemProps: {
                                                          defaultValue: "",
                                                          prop: "manager",
                                                          optionsPath: "EMPLOYEE",
                                                          labelKey: "$.personal[0].names[?(@.locale[0].code==\"CHN\"&&@.type==\"PREFERRED\")].nameCHN[0].displayName",
                                                          remoteFilterKey: "personal.names.nameCHN.displayName",
                                                          filter: {
                                                            params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"},
                                                            data: {"personal.names.type": "PREFERRED"}
                                                          }
                                                        }
                                                      }]
                                                  }
                                                }]
                                            }
                                          }]
                                      }]
                                  }]
                              }
                            ]
                          },
                          {
                            nodeType: "el-card",
                            slot: "steps",
                            style: {margin: "20px 0"},
                            children: [
                              {
                                nodeType: "el-steps",
                                props: {
                                  direction: "vertical",
                                  space: "100px",
                                  active: "{activeConfig.activeIndex}"
                                },
                                children: [
                                  {
                                    nodeType: "el-step",
                                    props: {title: "个人信息"}
                                  },
                                  {
                                    nodeType: "el-step",
                                    props: {title: "联系信息"}
                                  },
                                  {
                                    nodeType: "el-step",
                                    props: {title: "雇佣信息"}
                                  },
                                  {
                                    nodeType: "el-step",
                                    props: {title: "工作信息"}
                                  },
                                  {
                                    nodeType: "el-step",
                                    props: {title: "薪酬信息"}
                                  }
                                ]
                              }]
                          }
                        ]
                      }
                    ]
                  }]
              },
              {
                nodeType: "el-carousel-item",
                props: {name: "carouselItem4"},
                children: [
                  {
                    nodeType: "el-scrollbar",
                    children: [
                      {
                        nodeType: "ySteps",
                        props: {stepPosition: "right"},
                        children: [
                          {
                            nodeType: "el-container",
                            props: {"direction": "vertical"},
                            children: [
                              
                              // 薪酬信息
                              {
                                nodeType: "el-row",
                                style: {margin: "20px 20px 0 20px"},
                                children: [
                                  {
                                    nodeType: "el-col",
                                    children: [
                                      {
                                        nodeType: "el-card",
                                        props: {
                                          header: "薪酬信息",
                                          "body-style": {"padding": "0"}
                                        },
                                        children: [
                                          {
                                            nodeType: "y-pre-form",
                                            style: {padding: "30px  20px"},
                                            props: {
                                              model: "{formData.employeeData.compensation}",
                                              labelPosition: "top",
                                              span: 2,
                                              inline: true,
                                              items: [
                                                {
                                                  type: "select",
                                                  props: {label: "薪等"},
                                                  itemProps: {
                                                    defaultValue: "",
                                                    prop: "grade",
                                                    filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
                                                    optionsPath: "COMPENSATION.grade"
                                                  }
                                                },
                                                {
                                                  type: "select",
                                                  props: {label: "薪级"},
                                                  itemProps: {
                                                    defaultValue: "",
                                                    prop: "step",
                                                    filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
                                                    optionsPath: "COMPENSATION.step"
                                                  }
                                                }]
                                            }
                                          }]
                                      }]
                                  }]
                              },
                              // 薪酬项
                              {
                                nodeType: "el-row",
                                style: {margin: "20px 20px 0 20px"},
                                children: [
                                  {
                                    nodeType: "el-col",
                                    children: [
                                      {
                                        nodeType: "el-card",
                                        props: {"body-style": {padding: "0"}},
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
                                                innerHTML: "薪酬项"
                                              },
                                              {
                                                nodeType: "i",
                                                class: "el-icon-plus",
                                                on: {
                                                  click: "{" +
                                                    "formData.employeeData.payComponents=formData.employeeData.payComponents||[];" +
                                                    "formData.employeeData.payComponents.push({})}"
                                                }
                                              }]
                                          },
                                          {
                                            nodeType: "y-list",
                                            style: {padding: "10px 20px 30px 20px"},
                                            vIf: "{formData.employeeData.payComponents&&formData.employeeData.payComponents.length}",
                                            props: {forList: "{formData.employeeData.payComponents}"},
                                            scopedSlots: {
                                              default: [
                                                {
                                                  nodeType: "el-row",
                                                  scopeMapping: {
                                                    itemModel: "item",
                                                    index: "index"
                                                  },
                                                  props: {type: "flex"},
                                                  style: {
                                                    height: "30px",
                                                    "justify-content": "flex-end",
                                                    "align-items": "flex-end"
                                                  },
                                                  children: [
                                                    {
                                                      nodeType: "i",
                                                      class: "el-icon-delete",
                                                      on: {click: "{formData.employeeData.payComponents.splice(index,1)}"}
                                                    }]
                                                },
                                                {
                                                  nodeType: "y-pre-form",
                                                  scopeMapping: {itemModel: "item"},
                                                  props: {
                                                    model: "{itemModel}",
                                                    labelPosition: "top",
                                                    span: 2,
                                                    inline: true,
                                                    items: [
                                                      {
                                                        type: "select",
                                                        props: {
                                                          label: "薪酬项",
                                                          required: true
                                                        },
                                                        itemProps: {
                                                          defaultValue: "",
                                                          prop: "payComponent",
                                                          filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
                                                          optionsPath: "PAY_COMPONENTS.payComponent"
                                                        }
                                                      },
                                                      {
                                                        type: "select",
                                                        props: {
                                                          label: "货币",
                                                          required: true
                                                        },
                                                        itemProps: {
                                                          defaultValue: "",
                                                          prop: "currency",
                                                          filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
                                                          optionsPath: "CURRENCY"
                                                        }
                                                      },
                                                      {
                                                        type: "number",
                                                        props: {
                                                          label: "值",
                                                          required: true
                                                        },
                                                        itemProps: {
                                                          defaultValue: 0,
                                                          prop: "payRate",
                                                          precision: 2
                                                        }
                                                      }]
                                                  }
                                                }]
                                            }
                                          }]
                                      }]
                                  }]
                              }
                            ]
                          },
                          {
                            nodeType: "el-card",
                            slot: "steps",
                            style: {margin: "20px 0"},
                            children: [
                              {
                                nodeType: "el-steps",
                                props: {
                                  direction: "vertical",
                                  space: "100px",
                                  active: "{activeConfig.activeIndex}"
                                },
                                children: [
                                  {
                                    nodeType: "el-step",
                                    props: {title: "个人信息"}
                                  },
                                  {
                                    nodeType: "el-step",
                                    props: {title: "联系信息"}
                                  },
                                  {
                                    nodeType: "el-step",
                                    props: {title: "雇佣信息"}
                                  },
                                  {
                                    nodeType: "el-step",
                                    props: {title: "工作信息"}
                                  },
                                  {
                                    nodeType: "el-step",
                                    props: {title: "薪酬信息"}
                                  }
                                ]
                              }]
                          }]
                      }]
                  }]
              }]
          }]
      }
    ]
  }
})
