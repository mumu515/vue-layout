export default () => ({
  path: "/corehr/EMPLOYEE/index/view",
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
        toTerminate: [
          {
            type: "messageBox",
            config: {
              options: {
                message: "您确认要为该员工办理离职么",
                title: "办理离职确认",
                type: "warning",
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: "确定",
                cancelButtonText: "取消"
              }
            }
          },
          {
            type: "route",
            config: {
              action: "push",
              name: "CorehrObjectLayout",
              params: {pageType: "edit_employeeTerminate"},
              query: {
                instanceId: "{detailData.instanceId}",
                asOfDate: "{asOfDate}"
              }
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
            innerHTML: "查看员工",
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
                            innerHTML: "显示姓名",
                            slot: "label",
                            style: {color: "#999999"}
                          },
                          {
                            nodeType: "y-input",
                            props: {
                              displayOnly: true,
                              prop: "$.personal[0].names[?(@.locale[0].code==\"CHN\"&&@.type==\"PREFERRED\")].nameCHN[0].displayName"
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
                            innerHTML: "员工号",
                            slot: "label",
                            style: {color: "#999999"}
                          },
                          {
                            nodeType: "y-input",
                            props: {
                              displayOnly: true,
                              prop: "employment[0].employeeId"
                            }
                          }
                        ]
                      }]
                  },
                  {
                    nodeType: "el-dropdown",
                    style: {
                      flex: "none",
                      "align-self": "center"
                    },
                    children: [
                      {
                        nodeType: "el-button",
                        props: {type: "primary"},
                        children: [
                          {
                            nodeType: "span",
                            innerHTML: "Action"
                          },
                          {
                            nodeType: "i",
                            class: "el-icon-arrow-down el-icon--right"
                          }
                        ]
                      },
                      {
                        nodeType: "el-dropdown-menu",
                        slot: "dropdown",
                        children: [
                          {
                            nodeType: "el-dropdown-item",
                            vIf: "{detailData.employment[0].employmentStatus===\"ACTIVE\"}",
                            children: [
                              {
                                nodeType: "el-button",
                                props: {type: "text"},
                                innerHTML: "办理离职",
                                on: {
                                  click: {actionName: "toTerminate"}
                                }
                              }]
                          }
                        ]
                      }
                    ]
                  }
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
                  // 个人信息
                  {
                    nodeType: "el-tab-pane",
                    props: {label: "个人信息"},
                    children: [
                      {
                        nodeType: "el-tabs",
                        children: [
                          {
                            nodeType: "el-tab-pane",
                            props: {label: "档案资料"},
                            children: [
                              {
                                nodeType: "div",
                                class: "detail-label-title",
                                children: [
                                  {
                                    nodeType: "div",
                                    class: "begin-tag main-color-bg"
                                  },
                                  {
                                    nodeType: "div",
                                    class: "content",
                                    innerHTML: "档案资料"
                                  },
                                  {
                                    nodeType: "div",
                                    class: "end-tag"
                                  }
                                ]
                              },
                              {
                                nodeType: "y-pre-form",
                                style: {margin: "0 40px"},
                                props: {
                                  model: "{detailData.personal[0].biographical[0]}",
                                  span: 2,
                                  inline: true,
                                  items: [
                                    {
                                      type: "text",
                                      props: {label: "出生日期"},
                                      itemProps: {
                                        prop: "dateOfBirth",
                                        "displayOnly": true
                                      }
                                    },
                                    {
                                      type: "text",
                                      props: {label: "出生国家地区"},
                                      itemProps: {
                                        prop: "birthLocale[0].name",
                                        "displayOnly": true
                                      }
                                    }]
                                }
                              }]
                          },
                          {
                            nodeType: "el-tab-pane",
                            props: {label: "本地信息(中国)"},
                            children: [
                              {
                                nodeType: "div",
                                class: "detail-label-title",
                                children: [
                                  {
                                    nodeType: "div",
                                    class: "begin-tag main-color-bg"
                                  },
                                  {
                                    nodeType: "div",
                                    class: "content",
                                    innerHTML: "本地信息(中国)"
                                  },
                                  {
                                    nodeType: "div",
                                    class: "end-tag"
                                  }
                                ]
                              },
                              {
                                nodeType: "y-pre-form",
                                style: {margin: "0 40px"},
                                props: {
                                  model: "{detailData.personal[0].personRegional[0].personRegionalCHN[0]}",
                                  span: 2,
                                  inline: true,
                                  items: [
                                    {
                                      type: "select",
                                      props: {label: "国籍"},
                                      itemProps: {
                                        prop: "nationality",
                                        displayOnly: true,
                                        optionsPath: "PERSON_REGIONAL_CHN.nationality",
                                        filter: {params: {asOfDate: "{asOfDate}"}}
                                      }
                                    },
                                    {
                                      type: "select",
                                      props: {label: "性别"},
                                      itemProps: {
                                        prop: "gender",
                                        displayOnly: true,
                                        optionsPath: "PERSON_REGIONAL_CHN.gender",
                                        filter: {params: {asOfDate: "{asOfDate}"}}
                                      }
                                    },
                                    {
                                      type: "select",
                                      props: {label: "婚姻状态"},
                                      itemProps: {
                                        prop: "maritalStatus",
                                        displayOnly: true,
                                        optionsPath: "PERSON_REGIONAL_CHN.maritalStatus",
                                        filter: {params: {asOfDate: "{asOfDate}"}}
                                      }
                                    },
                                    {
                                      type: "select",
                                      props: {label: "户口"},
                                      itemProps: {
                                        prop: "huKou",
                                        displayOnly: true,
                                        optionsPath: "PERSON_REGIONAL_CHN.huKou",
                                        filter: {params: {asOfDate: "{asOfDate}"}}
                                      }
                                    },
                                    {
                                      type: "select",
                                      props: {label: "民族"},
                                      itemProps: {
                                        prop: "ethnicity",
                                        displayOnly: true,
                                        filter: {params: {asOfDate: "{asOfDate}"}},
                                        optionsPath: "PERSON_REGIONAL_CHN.ethnicity"
                                      }
                                    },
                                    {
                                      type: "select",
                                      props: {label: "政治面貌"},
                                      itemProps: {
                                        prop: "politicsStatus",
                                        displayOnly: true,
                                        filter: {params: {asOfDate: "{asOfDate}"}},
                                        optionsPath: "PERSON_REGIONAL_CHN.politicsStatus"
                                      }
                                    }
                                  ]
                                }
                              }]
                          },
                          {
                            nodeType: "el-tab-pane",
                            props: {label: "姓名"},
                            children: [
                              {
                                nodeType: "div",
                                class: "detail-label-title",
                                children: [
                                  {
                                    nodeType: "div",
                                    class: "begin-tag main-color-bg"
                                  },
                                  {
                                    nodeType: "div",
                                    class: "content",
                                    innerHTML: "姓名"
                                  },
                                  {
                                    nodeType: "div",
                                    class: "end-tag"
                                  }
                                ]
                              },
                              {
                                nodeType: "el-table",
                                style: {
                                  margin: "0 40px",
                                  width: "auto"
                                },
                                props: {data: "{detailData.personal[0].names}"},
                                children: [
                                  {
                                    nodeType: "el-table-column",
                                    props: {label: "类型"},
                                    scopedSlots: {
                                      default: {
                                        scopeMapping: {row: "row"},
                                        nodeType: "y-select",
                                        props: {
                                          model: "{row}",
                                          prop: "type",
                                          displayOnly: true,
                                          filter: {params: {asOfDate: "{asOfDate}"}},
                                          optionsPath: "NAME.type"
                                        }
                                      }
                                    }
                                  },
                                  {
                                    nodeType: "el-table-column",
                                    props: {
                                      label: "国家地区",
                                      prop: "locale[0].name"
                                    }
                                  },
                                  {
                                    nodeType: "el-table-column",
                                    props: {
                                      label: "显示姓名",
                                      prop: "nameCHN[0].displayName"
                                    }
                                  }
                                ]
                              }]
                          },
                          {
                            nodeType: "el-tab-pane",
                            props: {label: "个人身份标识号"},
                            children: [
                              {
                                nodeType: "div",
                                class: "detail-label-title",
                                children: [
                                  {
                                    nodeType: "div",
                                    class: "begin-tag main-color-bg"
                                  },
                                  {
                                    nodeType: "div",
                                    class: "content",
                                    innerHTML: "个人身份标识号"
                                  },
                                  {
                                    nodeType: "div",
                                    class: "end-tag"
                                  }
                                ]
                              },
                              {
                                nodeType: "el-table",
                                style: {
                                  margin: "0 40px",
                                  width: "auto"
                                },
                                props: {data: "{detailData.personal[0].identifiers}"},
                                children: [
                                  {
                                    nodeType: "el-table-column",
                                    props: {
                                      label: "国家地区",
                                      prop: "locale[0].name"
                                    }
                                  },
                                  {
                                    nodeType: "el-table-column",
                                    props: {label: "类型"},
                                    scopedSlots: {
                                      default: {
                                        scopeMapping: {row: "row"},
                                        nodeType: "y-select",
                                        props: {
                                          model: "{row}",
                                          prop: "identificationType",
                                          displayOnly: true,
                                          filter: {params: {asOfDate: "{asOfDate}"}},
                                          optionsPath: "IDENTIFIER.identificationType"
                                        }
                                      }
                                    }
                                  },
                                  {
                                    nodeType: "el-table-column",
                                    props: {
                                      label: "证件号",
                                      prop: "identificationId"
                                    }
                                  },
                                  {
                                    nodeType: "el-table-column",
                                    props: {
                                      label: "发证日期",
                                      prop: "issuedDate"
                                    }
                                  },
                                  {
                                    nodeType: "el-table-column",
                                    props: {
                                      label: "过期日期",
                                      prop: "expirationDate"
                                    }
                                  }
                                ]
                              }]
                          },
                          {
                            nodeType: "el-tab-pane",
                            props: {label: "银行账号"},
                            children: [
                              {
                                nodeType: "div",
                                class: "detail-label-title",
                                children: [
                                  {
                                    nodeType: "div",
                                    class: "begin-tag main-color-bg"
                                  },
                                  {
                                    nodeType: "div",
                                    class: "content",
                                    innerHTML: "银行账号"
                                  },
                                  {
                                    nodeType: "div",
                                    class: "end-tag"
                                  }
                                ]
                              },
                              {
                                nodeType: "el-table",
                                style: {
                                  margin: "0 40px",
                                  width: "auto"
                                },
                                props: {data: "{detailData.personal[0].bankAccounts}"},
                                children: [
                                  {
                                    nodeType: "el-table-column",
                                    props: {
                                      label: "国家地区",
                                      prop: "locale[0].name"
                                    }
                                  },
                                  {
                                    nodeType: "el-table-column",
                                    props: {label: "类型"},
                                    scopedSlots: {
                                      default: [
                                        {
                                          scopeMapping: {row: "row"},
                                          nodeType: "y-select",
                                          props: {
                                            model: "{row}",
                                            prop: "type",
                                            displayOnly: true,
                                            filter: {params: {asOfDate: "{asOfDate}"}},
                                            optionsPath: "BANK_ACCOUNT.type"
                                          }
                                        }]
                                    }
                                  },
                                  {
                                    nodeType: "el-table-column",
                                    props: {
                                      label: "银行",
                                      prop: "bank[0].name"
                                    }
                                  },
                                  {
                                    nodeType: "el-table-column",
                                    props: {
                                      label: "支行",
                                      prop: "bankBranch[0].name"
                                    }
                                  },
                                  {
                                    nodeType: "el-table-column",
                                    props: {
                                      label: "账户名",
                                      prop: "accountName"
                                    }
                                  },
                                  {
                                    nodeType: "el-table-column",
                                    props: {
                                      label: "账户",
                                      prop: "accountNumber"
                                    }
                                  }
                                ]
                              }]
                          },
                          {
                            nodeType: "el-tab-pane",
                            props: {label: "家庭成员以及社会关系"},
                            children: [
                              {
                                nodeType: "div",
                                class: "detail-label-title",
                                children: [
                                  {
                                    nodeType: "div",
                                    class: "begin-tag main-color-bg"
                                  },
                                  {
                                    nodeType: "div",
                                    class: "content",
                                    innerHTML: "家庭成员以及社会关系"
                                  },
                                  {
                                    nodeType: "div",
                                    class: "end-tag"
                                  }
                                ]
                              },
                              {
                                nodeType: "el-table",
                                style: {
                                  margin: "0 40px",
                                  width: "auto"
                                },
                                props: {data: "{detailData.personal[0].familyDependents}"},
                                children: [
                                  {
                                    nodeType: "el-table-column",
                                    props: {label: "关系"},
                                    scopedSlots: {
                                      default: {
                                        scopeMapping: {row: "row"},
                                        nodeType: "y-select",
                                        props: {
                                          model: "{row}",
                                          prop: "relationship",
                                          displayOnly: true,
                                          filter: {params: {asOfDate: "{asOfDate}"}},
                                          optionsPath: "FAMILY_DEPENDENT.relationship"
                                        }
                                      }
                                    }
                                  },
                                  {
                                    nodeType: "el-table-column",
                                    props: {label: "家庭成员以及社会关系人"},
                                    scopedSlots: {
                                      default: {
                                        scopeMapping: {row: "row"},
                                        nodeType: "y-input",
                                        props: {
                                          model: "{row.familyDependentPerson[0]}",
                                          displayOnly: true,
                                          prop: "$.names[?(@.locale[0].code==\"CHN\"&&@.type==\"PREFERRED\")].nameCHN[0].displayName"
                                        }
                                      }
                                    }
                                  }
                                ]
                              }]
                          }
                        ]
                      }
                    ]
                  },
                  // 联系方式
                  {
                    nodeType: "el-tab-pane",
                    props: {label: "联系方式"},
                    children: [
                      // 地址
                      {
                        nodeType: "div",
                        class: "detail-label-title",
                        children: [
                          {
                            nodeType: "div",
                            class: "begin-tag main-color-bg"
                          },
                          {
                            nodeType: "div",
                            class: "content",
                            innerHTML: "地址"
                          },
                          {
                            nodeType: "div",
                            class: "end-tag"
                          }
                        ]
                      },
                      {
                        nodeType: "el-table",
                        style: {
                          margin: "0 40px",
                          width: "auto"
                        },
                        props: {data: "{detailData.personal[0].addresses}"},
                        children: [
                          {
                            nodeType: "el-table-column",
                            props: {label: "类型"},
                            scopedSlots: {
                              default: {
                                scopeMapping: {row: "row"},
                                nodeType: "y-select",
                                props: {
                                  model: "{row}",
                                  prop: "type",
                                  displayOnly: true,
                                  filter: {params: {asOfDate: "{asOfDate}"}},
                                  optionsPath: "ADDRESS.type"
                                }
                              }
                            }
                          },
                          {
                            nodeType: "el-table-column",
                            props: {
                              label: "国家地区",
                              prop: "locale[0].name"
                            }
                          },
                          {
                            nodeType: "el-table-column",
                            props: {label: "显示地址"},
                            scopedSlots: {
                              default: [
                                {
                                  scopeMapping: {"model": "row"},
                                  nodeType: "span",
                                  children: [
                                    {
                                      nodeType: "span",
                                      innerHTML: "{model.addressCHN[0].locale[0].name||\"\"}"
                                    },
                                    {
                                      nodeType: "span",
                                      innerHTML: "{\" \"+(model.addressCHN[0].region[0].name||\"\")}"
                                    },
                                    {
                                      nodeType: "span",
                                      innerHTML: "{\" \"+(model.addressCHN[0].city[0].name||\"\")}"
                                    },
                                    {
                                      nodeType: "span",
                                      innerHTML: "{\" \"+(model.addressCHN[0].district[0].name||\"\")}"
                                    },
                                    {
                                      nodeType: "span",
                                      innerHTML: "{\" \"+(model.addressCHN[0].subDistrict[0].name||\"\")}"
                                    },
                                    {
                                      nodeType: "span",
                                      innerHTML: "{\" \"+(model.addressCHN[0].address1||\"\")}"
                                    }]
                                }]
                            }
                          }
                        ]
                      },
                      // 电话
                      {
                        nodeType: "div",
                        class: "detail-label-title",
                        children: [
                          {
                            nodeType: "div",
                            class: "begin-tag main-color-bg"
                          },
                          {
                            nodeType: "div",
                            class: "content",
                            innerHTML: "电话"
                          },
                          {
                            nodeType: "div",
                            class: "end-tag"
                          }
                        ]
                      },
                      {
                        nodeType: "el-table",
                        style: {
                          margin: "0 40px",
                          width: "auto"
                        },
                        props: {data: "{detailData.personal[0].phones}"},
                        children: [
                          {
                            nodeType: "el-table-column",
                            props: {label: "类型"},
                            scopedSlots: {
                              default: {
                                scopeMapping: {row: "row"},
                                nodeType: "y-select",
                                props: {
                                  model: "{row}",
                                  prop: "type",
                                  displayOnly: true,
                                  filter: {params: {asOfDate: "{asOfDate}"}},
                                  optionsPath: "PHONE.type"
                                }
                              }
                            }
                          },
                          {
                            nodeType: "el-table-column",
                            props: {
                              label: "国家地区",
                              prop: "locale[0].name"
                            }
                          },
                          {
                            nodeType: "el-table-column",
                            props: {
                              label: "显示电话",
                              prop: "phoneNumber"
                            }
                          }
                        ]
                      },
                      // 邮箱
                      {
                        nodeType: "div",
                        class: "detail-label-title",
                        children: [
                          {
                            nodeType: "div",
                            class: "begin-tag main-color-bg"
                          },
                          {
                            nodeType: "div",
                            class: "content",
                            innerHTML: "邮箱"
                          },
                          {
                            nodeType: "div",
                            class: "end-tag"
                          }
                        ]
                      },
                      {
                        nodeType: "el-table",
                        style: {
                          margin: "0 40px",
                          width: "auto"
                        },
                        props: {data: "{detailData.personal[0].emails}"},
                        children: [
                          {
                            nodeType: "el-table-column",
                            props: {label: "类型"},
                            scopedSlots: {
                              default: [
                                {
                                  scopeMapping: {row: "row"},
                                  nodeType: "y-select",
                                  props: {
                                    model: "{row}",
                                    prop: "type",
                                    displayOnly: true,
                                    filter: {params: {asOfDate: "{asOfDate}"}},
                                    optionsPath: "EMAIL.type"
                                  }
                                }]
                            }
                          },
                          {
                            nodeType: "el-table-column",
                            props: {
                              label: "邮箱",
                              prop: "email"
                            }
                          }
                        ]
                      },
                      // 紧急联系人
                      {
                        nodeType: "div",
                        class: "detail-label-title",
                        children: [
                          {
                            nodeType: "div",
                            class: "begin-tag main-color-bg"
                          },
                          {
                            nodeType: "div",
                            class: "content",
                            innerHTML: "紧急联系人"
                          },
                          {
                            nodeType: "div",
                            class: "end-tag"
                          }
                        ]
                      },
                      {
                        nodeType: "el-table",
                        style: {
                          margin: "0 40px",
                          width: "auto"
                        },
                        props: {data: "{detailData.personal[0].emergencyContacts}"},
                        children: [
                          {
                            nodeType: "el-table-column",
                            props: {label: "关系"},
                            scopedSlots: {
                              default: [
                                {
                                  scopeMapping: {row: "row"},
                                  nodeType: "y-select",
                                  props: {
                                    model: "{row}",
                                    prop: "relationship",
                                    displayOnly: true,
                                    filter: {params: {asOfDate: "{asOfDate}"}},
                                    optionsPath: "PERSON.emergencyContacts.relationship"
                                  }
                                }]
                            }
                          },
                          {
                            nodeType: "el-table-column",
                            props: {label: "紧急联系人"},
                            scopedSlots: {
                              default: [
                                {
                                  scopeMapping: {row: "row"},
                                  nodeType: "y-input",
                                  props: {
                                    model: "{row}",
                                    prop: "$.emergencyContactPerson[0].names[?(@.locale[0].code==\"CHN\"&&@.type==\"PREFERRED\")].nameCHN[0].displayName",
                                    displayOnly: true
                                  }
                                }]
                            }
                          }]
                      },
                      // 其他联系方式
                      {
                        nodeType: "div",
                        class: "detail-label-title",
                        children: [
                          {
                            nodeType: "div",
                            class: "begin-tag main-color-bg"
                          },
                          {
                            nodeType: "div",
                            class: "content",
                            innerHTML: "其他联系方式"
                          },
                          {
                            nodeType: "div",
                            class: "end-tag"
                          }
                        ]
                      },
                      {
                        nodeType: "el-table",
                        style: {
                          margin: "0 40px",
                          width: "auto"
                        },
                        props: {data: "{detailData.personal[0].otherContacts}"},
                        children: [
                          {
                            nodeType: "el-table-column",
                            props: {label: "类型"},
                            scopedSlots: {
                              default: [
                                {
                                  scopeMapping: {row: "row"},
                                  nodeType: "y-select",
                                  props: {
                                    model: "{row}",
                                    prop: "otherContactType",
                                    displayOnly: true,
                                    filter: {params: {asOfDate: "{asOfDate}"}},
                                    optionsPath: "OTHER_CONTACT.otherContactType"
                                  }
                                }]
                            }
                          },
                          {
                            nodeType: "el-table-column",
                            props: {
                              label: "其他联系方式ID",
                              prop: "otherContactId"
                            }
                          }]
                      }
                    
                    ]
                  },
                  // 雇佣关系
                  {
                    nodeType: "el-tab-pane",
                    props: {label: "雇佣关系"},
                    children: [
                      {
                        nodeType: "div",
                        class: "detail-label-title",
                        children: [
                          {
                            nodeType: "div",
                            class: "begin-tag main-color-bg"
                          },
                          {
                            nodeType: "div",
                            class: "content",
                            innerHTML: "雇佣信息"
                          },
                          {
                            nodeType: "div",
                            class: "end-tag"
                          }
                        ]
                      },
                      {
                        nodeType: "y-pre-form",
                        style: {margin: "0 40px"},
                        props: {
                          span: 2,
                          model: "{detailData.employment[0]}",
                          inline: true,
                          items: [
                            {
                              type: "text",
                              props: {label: "雇佣工号"},
                              itemProps: {
                                prop: "employeeId",
                                "displayOnly": true
                              }
                            },
                            {
                              type: "select",
                              props: {label: "雇佣类型"},
                              itemProps: {
                                prop: "employmentType",
                                displayOnly: true,
                                filter: {params: {asOfDate: "{asOfDate}"}},
                                optionsPath: "EMPLOYMENT.employmentType"
                              }
                            },
                            {
                              type: "select",
                              props: {label: "雇佣生效状态"},
                              itemProps: {
                                prop: "employmentStatus",
                                displayOnly: true,
                                filter: {params: {asOfDate: "{asOfDate}"}},
                                optionsPath: "EMPLOYMENT.employmentStatus"
                              }
                            },
                            {
                              type: "text",
                              props: {label: "最初入职日期"},
                              itemProps: {
                                prop: "originalHireDate",
                                displayOnly: true
                              }
                            },
                            {
                              type: "text",
                              props: {label: "最终离职日期"},
                              itemProps: {
                                prop: "finalTerminationDate",
                                displayOnly: true
                              }
                            },
                            {
                              type: "text",
                              props: {label: "最终最后工作日"},
                              itemProps: {
                                prop: "finalLastWorkDate",
                                displayOnly: true
                              }
                            },
                            {
                              type: "text",
                              props: {label: "司龄"},
                              itemProps: {
                                prop: "seniorityDays",
                                displayOnly: true
                              }
                            }
                          ]
                        }
                      },
                      // 劳动关系
                      {
                        nodeType: "div",
                        class: "detail-label-title",
                        children: [
                          {
                            nodeType: "div",
                            class: "begin-tag main-color-bg"
                          },
                          {
                            nodeType: "div",
                            class: "content",
                            innerHTML: "劳动关系"
                          },
                          {
                            nodeType: "div",
                            class: "end-tag"
                          }
                        ]
                      },
                      {
                        nodeType: "el-table",
                        style: {margin: "0 40px"},
                        props: {data: "{detailData.workRelationships}"},
                        children: [
                          {
                            nodeType: "el-table-column",
                            props: {label: "分配类型"},
                            scopedSlots: {
                              default: {
                                scopeMapping: {row: "row"},
                                nodeType: "y-select",
                                props: {
                                  model: "{row}",
                                  prop: "assignmentType",
                                  displayOnly: true,
                                  filter: {params: {asOfDate: "{asOfDate}"}},
                                  optionsPath: "WORK_RELATIONSHIPS.assignmentType"
                                }
                              }
                            }
                          },
                          {
                            nodeType: "el-table-column",
                            props: {
                              label: "劳动关系ID",
                              prop: "workRelationshipId"
                            }
                          },
                          {
                            nodeType: "el-table-column",
                            props: {label: "劳动关系类型"},
                            scopedSlots: {
                              default: {
                                scopeMapping: {row: "row"},
                                nodeType: "y-select",
                                props: {
                                  model: "{row}",
                                  prop: "workRelationshipType",
                                  displayOnly: true,
                                  filter: {params: {asOfDate: "{asOfDate}"}},
                                  optionsPath: "WORK_RELATIONSHIPS.workRelationshipType"
                                }
                              }
                            }
                          },
                          {
                            nodeType: "el-table-column",
                            props: {label: "劳动关系状态"},
                            scopedSlots: {
                              default: {
                                scopeMapping: {row: "row"},
                                nodeType: "y-select",
                                props: {
                                  model: "{row}",
                                  prop: "workRelationshipStatus",
                                  displayOnly: true,
                                  filter: {params: {asOfDate: "{asOfDate}"}},
                                  optionsPath: "WORK_RELATIONSHIPS.workRelationshipStatus"
                                }
                              }
                            }
                          },
                          {
                            nodeType: "el-table-column",
                            props: {label: "入职日期"},
                            scopedSlots: {
                              default: {
                                scopeMapping: {row: "row"},
                                nodeType: "y-date-picker",
                                props: {
                                  model: "{row}",
                                  prop: "hireDate",
                                  displayOnly: true
                                }
                              }
                            }
                          },
                          {
                            nodeType: "el-table-column",
                            props: {label: "离职日期"},
                            scopedSlots: {
                              default: {
                                scopeMapping: {row: "row"},
                                nodeType: "y-date-picker",
                                props: {
                                  model: "{row}",
                                  prop: "terminationDate",
                                  displayOnly: true
                                }
                              }
                            }
                          },
                          {
                            nodeType: "el-table-column",
                            props: {label: "最后工作日"},
                            scopedSlots: {
                              default: {
                                scopeMapping: {row: "row"},
                                nodeType: "y-date-picker",
                                props: {
                                  model: "{row}",
                                  prop: "lastWorkDate",
                                  displayOnly: true
                                }
                              }
                            }
                          }
                        ]
                        
                      },
                      // 劳动关系
                      {
                        nodeType: "div",
                        class: "detail-label-title",
                        children: [
                          {
                            nodeType: "div",
                            class: "begin-tag main-color-bg"
                          },
                          {
                            nodeType: "div",
                            class: "content",
                            innerHTML: "劳动合同"
                          },
                          {
                            nodeType: "div",
                            class: "end-tag"
                          }
                        ]
                      },
                      {
                        nodeType: "el-table",
                        style: {margin: "0 40px"},
                        props: {data: "{detailData.contracts}"},
                        children: [
                          {
                            nodeType: "el-table-column",
                            props: {label: "类型"},
                            scopedSlots: {
                              default: {
                                scopeMapping: {row: "row"},
                                nodeType: "y-select",
                                props: {
                                  model: "{row}",
                                  prop: "type",
                                  displayOnly: true,
                                  filter: {params: {asOfDate: "{asOfDate}"}},
                                  optionsPath: "CONTRACTS.type"
                                }
                              }
                            }
                          },
                          {
                            nodeType: "el-table-column",
                            props: {label: "开始日期"},
                            scopedSlots: {
                              default: {
                                scopeMapping: {row: "row"},
                                nodeType: "y-date-picker",
                                props: {
                                  model: "{row}",
                                  prop: "startDate",
                                  displayOnly: true
                                }
                              }
                            }
                          },
                          {
                            nodeType: "el-table-column",
                            props: {label: "结束日期"},
                            scopedSlots: {
                              default: {
                                scopeMapping: {row: "row"},
                                nodeType: "y-date-picker",
                                props: {
                                  model: "{row}",
                                  prop: "endDate",
                                  displayOnly: true
                                }
                              }
                            }
                          }
                        ]
                      }
                    ]
                  },
                  // 工作信息
                  {
                    nodeType: "el-tab-pane",
                    props: {label: "工作信息"},
                    children: [
                      // 职位
                      {
                        nodeType: "div",
                        class: "detail-label-title",
                        children: [
                          {
                            nodeType: "div",
                            class: "begin-tag main-color-bg"
                          },
                          {
                            nodeType: "div",
                            class: "content",
                            innerHTML: "职位"
                          },
                          {
                            nodeType: "div",
                            class: "end-tag"
                          }
                        ]
                      },
                      {
                        nodeType: "el-table",
                        style: {margin: "0 40px"},
                        props: {data: "{detailData.positions}"},
                        children: [
                          {
                            nodeType: "el-table-column",
                            props: {label: "分配类型"},
                            scopedSlots: {
                              default: {
                                scopeMapping: {row: "row"},
                                nodeType: "y-select",
                                props: {
                                  model: "{row}",
                                  prop: "assignmentType",
                                  displayOnly: true,
                                  filter: {params: {asOfDate: "{asOfDate}"}},
                                  optionsPath: "POSITIONS.assignmentType"
                                }
                              }
                            }
                          },
                          {
                            nodeType: "el-table-column",
                            props: {label: "职位"},
                            scopedSlots: {
                              default: {
                                scopeMapping: {row: "row"},
                                nodeType: "y-select",
                                props: {
                                  model: "{row}",
                                  prop: "position[0].instanceId",
                                  displayOnly: true,
                                  filter: {params: {asOfDate: "{asOfDate}"}},
                                  optionsPath: "POSITION"
                                }
                              }
                            }
                          }
                        ]
                      },
                      // 职务
                      {
                        nodeType: "div",
                        class: "detail-label-title",
                        children: [
                          {
                            nodeType: "div",
                            class: "begin-tag main-color-bg"
                          },
                          {
                            nodeType: "div",
                            class: "content",
                            innerHTML: "职务"
                          },
                          {
                            nodeType: "div",
                            class: "end-tag"
                          }
                        ]
                      },
                      {
                        nodeType: "el-table",
                        style: {margin: "0 40px"},
                        props: {data: "{detailData.jobs}"},
                        children: [
                          {
                            nodeType: "el-table-column",
                            props: {label: "分配类型"},
                            scopedSlots: {
                              default: {
                                scopeMapping: {row: "row"},
                                nodeType: "y-select",
                                props: {
                                  model: "{row}",
                                  prop: "assignmentType",
                                  displayOnly: true,
                                  filter: {params: {asOfDate: "{asOfDate}"}},
                                  optionsPath: "JOBS.assignmentType"
                                }
                              }
                            }
                          },
                          {
                            nodeType: "el-table-column",
                            props: {label: "职务"},
                            scopedSlots: {
                              default: {
                                scopeMapping: {row: "row"},
                                nodeType: "y-select",
                                props: {
                                  model: "{row}",
                                  prop: "job[0].instanceId",
                                  displayOnly: true,
                                  filter: {params: {asOfDate: "{asOfDate}"}},
                                  optionsPath: "JOB"
                                }
                              }
                            }
                          }
                        ]
                        
                      },
                      // 职级
                      {
                        nodeType: "div",
                        class: "detail-label-title",
                        children: [
                          {
                            nodeType: "div",
                            class: "begin-tag main-color-bg"
                          },
                          {
                            nodeType: "div",
                            class: "content",
                            innerHTML: "职级"
                          },
                          {
                            nodeType: "div",
                            class: "end-tag"
                          }
                        ]
                      },
                      {
                        nodeType: "el-table",
                        style: {margin: "0 40px"},
                        props: {data: "{detailData.managementLevels}"},
                        children: [
                          {
                            nodeType: "el-table-column",
                            props: {label: "分配类型"},
                            scopedSlots: {
                              default: {
                                scopeMapping: {row: "row"},
                                nodeType: "y-select",
                                props: {
                                  model: "{row}",
                                  prop: "assignmentType",
                                  displayOnly: true,
                                  filter: {params: {asOfDate: "{asOfDate}"}},
                                  optionsPath: "MANAGEMENT_LEVELS.assignmentType"
                                }
                              }
                            }
                          },
                          {
                            nodeType: "el-table-column",
                            props: {label: "职级"},
                            scopedSlots: {
                              default: {
                                scopeMapping: {row: "row"},
                                nodeType: "y-select",
                                props: {
                                  model: "{row}",
                                  prop: "managementLevel[0].instanceId",
                                  displayOnly: true,
                                  filter: {params: {asOfDate: "{asOfDate}"}},
                                  optionsPath: "MANAGEMENT_LEVEL"
                                }
                              }
                            }
                          }
                        ]
                      }
                    ]
                  },
                  // 组织信息
                  {
                    nodeType: "el-tab-pane",
                    props: {label: "组织信息"},
                    children: [
                      // 组织信息
                      {
                        nodeType: "div",
                        class: "detail-label-title",
                        children: [
                          {
                            nodeType: "div",
                            class: "begin-tag main-color-bg"
                          },
                          {
                            nodeType: "div",
                            class: "content",
                            innerHTML: "组织信息"
                          },
                          {
                            nodeType: "div",
                            class: "end-tag"
                          }
                        ]
                      },
                      {
                        nodeType: "el-table",
                        style: {margin: "0 40px"},
                        props: {data: "{detailData.organizations}"},
                        children: [
                          {
                            nodeType: "el-table-column",
                            props: {label: "组织类型"},
                            scopedSlots: {
                              default: {
                                scopeMapping: {row: "row"},
                                nodeType: "y-select",
                                props: {
                                  model: "{row}",
                                  prop: "type",
                                  displayOnly: true,
                                  filter: {params: {asOfDate: "{asOfDate}"}},
                                  optionsPath: "ORGANIZATIONS.type"
                                }
                              }
                            }
                          },
                          {
                            nodeType: "el-table-column",
                            props: {label: "分配类型"},
                            scopedSlots: {
                              default: {
                                scopeMapping: {row: "row"},
                                nodeType: "y-select",
                                props: {
                                  model: "{row}",
                                  prop: "assignmentType",
                                  displayOnly: true,
                                  filter: {params: {asOfDate: "{asOfDate}"}},
                                  optionsPath: "ORGANIZATIONS.assignmentType"
                                }
                              }
                            }
                          },
                          {
                            nodeType: "el-table-column",
                            props: {label: "组织"},
                            scopedSlots: {
                              default: {
                                scopeMapping: {row: "row"},
                                nodeType: "y-select",
                                props: {
                                  model: "{row}",
                                  prop: "organization[0].instanceId",
                                  displayOnly: true,
                                  filter: {params: {asOfDate: "{asOfDate}"}},
                                  optionsPath: "ORGANIZATION"
                                }
                              }
                            }
                          }
                        ]
                      }
                    ]
                  },
                  // 汇报关系
                  {
                    nodeType: "el-tab-pane",
                    props: {label: "汇报关系"},
                    children: [
                      // 汇报关系
                      {
                        nodeType: "div",
                        class: "detail-label-title",
                        children: [
                          {
                            nodeType: "div",
                            class: "begin-tag main-color-bg"
                          },
                          {
                            nodeType: "div",
                            class: "content",
                            innerHTML: "汇报关系"
                          },
                          {
                            nodeType: "div",
                            class: "end-tag"
                          }
                        ]
                      },
                      {
                        nodeType: "el-table",
                        style: {margin: "0 40px"},
                        props: {data: "{detailData.managers}"},
                        children: [
                          {
                            nodeType: "el-table-column",
                            props: {label: "类型"},
                            scopedSlots: {
                              default: {
                                scopeMapping: {row: "row"},
                                nodeType: "y-select",
                                props: {
                                  model: "{row}",
                                  prop: "type",
                                  displayOnly: true,
                                  filter: {params: {asOfDate: "{asOfDate}"}},
                                  optionsPath: "MANAGERS.type"
                                }
                              }
                            }
                          },
                          {
                            nodeType: "el-table-column",
                            props: {label: "主管"},
                            scopedSlots: {
                              default: {
                                scopeMapping: {row: "row"},
                                nodeType: "y-input",
                                props: {
                                  model: "{row}",
                                  displayOnly: true,
                                  prop: "$.manager[0].personal[0].names[?(@.locale[0].code==\"CHN\"&&@.type==\"PREFERRED\")].nameCHN[0].displayName"
                                }
                              }
                              // default: {
                              // 	scopeMapping: {row: "row"}, nodeType: "y-select",
                              // 	props: {model: "{row}", prop: "manager[0].instanceId", displayOnly: true, filter: {params: {asOfDate: "{asOfDate}"}},optionsPath: "EMPLOYEE",
                              // 		labelKey: "$.personal[0].names[?(@.locale[0].code==\"CHN\")].nameCHN[0].displayName",
                              // 		remoteFilterKey: "personal.names.nameCHN.displayName"}
                              // }
                            }
                          }
                        ]
                      }
                    ]
                  },
                  // 薪酬信息
                  {
                    nodeType: "el-tab-pane",
                    props: {label: "薪酬信息"},
                    children: [
                      //薪酬信息
                      {
                        nodeType: "div",
                        class: "detail-label-title",
                        children: [
                          {
                            nodeType: "div",
                            class: "begin-tag main-color-bg"
                          },
                          {
                            nodeType: "div",
                            class: "content",
                            innerHTML: "薪酬信息"
                          },
                          {
                            nodeType: "div",
                            class: "end-tag"
                          }
                        ]
                      },
                      {
                        nodeType: "y-pre-form",
                        style: {margin: "0 40px"},
                        props: {
                          model: "{detailData.compensation[0]}",
                          span: 2,
                          inline: true,
                          items: [
                            {
                              type: "select",
                              props: {label: "薪等"},
                              itemProps: {
                                prop: "grade[0].instanceId",
                                displayOnly: true,
                                filter: {params: {asOfDate: "{asOfDate}"}},
                                optionsPath: "COMPENSATION.grade"
                              }
                            },
                            {
                              type: "select",
                              props: {label: "薪级"},
                              itemProps: {
                                prop: "step[0].instanceId",
                                displayOnly: true,
                                filter: {params: {asOfDate: "{asOfDate}"}},
                                optionsPath: "COMPENSATION.step"
                              }
                            }]
                        }
                      },
                      // 薪酬项
                      {
                        nodeType: "div",
                        class: "detail-label-title",
                        children: [
                          {
                            nodeType: "div",
                            class: "begin-tag main-color-bg"
                          },
                          {
                            nodeType: "div",
                            class: "content",
                            innerHTML: "薪酬项"
                          },
                          {
                            nodeType: "div",
                            class: "end-tag"
                          }
                        ]
                      },
                      {
                        nodeType: "el-table",
                        style: {margin: "0 40px"},
                        props: {data: "{detailData.payComponents}"},
                        children: [
                          {
                            nodeType: "el-table-column",
                            props: {label: "薪酬项"},
                            scopedSlots: {
                              default: {
                                scopeMapping: {row: "row"},
                                nodeType: "y-select",
                                props: {
                                  model: "{row}",
                                  prop: "payComponent[0].instanceId",
                                  displayOnly: true,
                                  filter: {params: {asOfDate: "{asOfDate}"}},
                                  optionsPath: "PAY_COMPONENT"
                                }
                              }
                            }
                          },
                          {
                            nodeType: "el-table-column",
                            props: {label: "货币"},
                            scopedSlots: {
                              default: {
                                scopeMapping: {row: "row"},
                                nodeType: "y-select",
                                props: {
                                  model: "{row}",
                                  prop: "currency[0].instanceId",
                                  displayOnly: true,
                                  filter: {params: {asOfDate: "{asOfDate}"}},
                                  optionsPath: "CURRENCY"
                                }
                              }
                            }
                          },
                          {
                            nodeType: "el-table-column",
                            props: {label: "值"},
                            scopedSlots: {
                              default: {
                                scopeMapping: {row: "row"},
                                nodeType: "y-input",
                                props: {
                                  model: "{row}",
                                  prop: "payRate",
                                  displayOnly: true
                                }
                              }
                            }
                          }]
                      }]
                  },
                  // 薪资信息
                  {
                    nodeType: "el-tab-pane",
                    props: {label: "薪资信息"},
                    children: [
                      // 支付信息
                      {
                        nodeType: "div",
                        class: "detail-label-title",
                        children: [
                          {
                            nodeType: "div",
                            class: "begin-tag main-color-bg"
                          },
                          {
                            nodeType: "div",
                            class: "content",
                            innerHTML: "支付信息"
                          },
                          {
                            nodeType: "div",
                            class: "end-tag"
                          }
                        ]
                      },
                      {
                        nodeType: "el-table",
                        style: {margin: "0 40px"},
                        props: {data: "{detailData.payments}"},
                        children: [
                          {
                            nodeType: "el-table-column",
                            props: {label: "支付类型"},
                            scopedSlots: {
                              default: {
                                scopeMapping: {row: "row"},
                                nodeType: "y-select",
                                props: {
                                  model: "{row}",
                                  prop: "paymentType",
                                  displayOnly: true,
                                  filter: {params: {asOfDate: "{asOfDate}"}},
                                  optionsPath: "PAYMENTS.paymentType"
                                }
                              }
                            }
                          },
                          {
                            nodeType: "el-table-column",
                            props: {label: "国家地区"},
                            scopedSlots: {
                              default: {
                                scopeMapping: {row: "row"},
                                nodeType: "y-select",
                                props: {
                                  model: "{row}",
                                  prop: "locale[0].instanceId",
                                  displayOnly: true,
                                  filter: {params: {asOfDate: "{asOfDate}"}},
                                  optionsPath: "LOCALE"
                                }
                              }
                            }
                          },
                          {
                            nodeType: "el-table-column",
                            props: {label: "银行卡号"},
                            scopedSlots: {
                              default: {
                                scopeMapping: {row: "row"},
                                nodeType: "y-input",
                                props: {
                                  model: "{row}",
                                  prop: "bankAccount[0].accountNumber",
                                  displayOnly: true
                                }
                              }
                            }
                          },
                          {
                            nodeType: "el-table-column",
                            props: {label: "货币"},
                            scopedSlots: {
                              default: {
                                scopeMapping: {row: "row"},
                                nodeType: "y-select",
                                props: {
                                  model: "{row}",
                                  prop: "currency[0].instanceId",
                                  displayOnly: true,
                                  filter: {params: {asOfDate: "{asOfDate}"}},
                                  optionsPath: "PAYMENTS.currency"
                                }
                              }
                            }
                          }
                        ]
                      }
                    ]
                  }
                ]
              }]
          }
        ]
      }
    ]
  }
})
