export default () => ({
  namespaced: true,
  state: {},
  getters: {
    scopes: (state, getters, rootState, rootGetters) => (payload) => {
      return [
        {
          scopeId: 1,
          data: {
            objectCode: payload.objectCode,
            asOfDate: payload.asOfDate,
            instanceId: payload.instanceId,
            formData: {
              personData: {externalId: "$instance:1"},
              employeeData: {personal: {"PERSON_EXTERNALID_UNIQUE": "$instance:1"}}
            },
            detailInfo: {},
            detailInfo1: {}
          },
          action: {
            init: ["getDetail"],
            getDetail: [
              {
                type: "api",
                config: {
                  url: "{\"/biz/\"+objectCode+\"/\"+instanceId}",
                  type: "GET",
                  headers: {},
                  params: {
                    depth: 6,
                    asOfDate: payload.asOfDate
                  },
                  $response: {data: "{detailInfo}"}
                }
              },
              {
                type: "eval",
                config: {eval: "detailInfo1=generateDetailInfo(detailInfo)"}
              }
              // {type: "eval", config: {eval: "Utils.setEvalData(data,\"detailInfo1\",generateDetailInfo(detailInfo))"}}
            ],
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
                        eventCode: "integration.person.create",
                        effectiveDate: "{formData.effectiveDate}",
                        data: [{payload: "{formData.personData}"}]
                      },
                      {
                        eventCode: "integration.employee.create",
                        effectiveDate: "{formData.effectiveDate}",
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
        }];
    },
    layout: (state, getters, rootState, rootGetters) => (payload) => {
      return {
        nodeType: "el-container",
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
                        nodeType: "span",
                        class: "el-icon-arrow-left icon-back",
                        style: {"font-size": "17px"},
                        on: {click: {actionName: "toList"}}
                      },
                      {
                        nodeType: "h2",
                        innerHTML: "入职新员工",
                        style: {margin: "0 20px !important"}
                      }
                    ]
                  }]
              }]
          },
          {
            nodeType: "el-container",
            props: {direction: "vertical"},
            children: [
              {
                nodeType: "el-form",
                props: {model: "{formData}"},
                children: [
                  //个人信息
                  {
                    nodeType: "el-card",
                    style: {margin: "20px 20px 0 20px"},
                    props: {
                      header: "档案资料",
                      "body-style": {padding: "20px 40px"}
                    },
                    children: [
                      {
                        nodeType: "y-pre-form",
                        vInit: "{formData.personData.biographical=formData.personData.biographical||{}}",
                        // vInit: "{Utils.setEvalData(data,\"formData.personData.biographical\",{},true)}",
                        props: {
                          model: "{formData.personData.biographical}",
                          labelPosition: "top",
                          span: 3,
                          inline: true,
                          items: [
                            {
                              props: {label: "出生日期"},
                              type: "date",
                              itemProps: {prop: "dateOfBirth"}
                            },
                            {
                              props: {label: "出生国家地区"},
                              type: "select",
                              itemProps: {
                                prop: "birthLocale",
                                optionsPath: "LOCALE"
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
                      "body-style": {padding: "20px 40px"}
                    },
                    children: [
                      {
                        nodeType: "y-pre-form",
                        vInit: "{formData.personData.personRegional.personRegionalCHN=formData.personData.personRegional.personRegionalCHN||{}}",
                        // vInit: "{Utils.setEvalData(data,\"formData.personData.personRegional.personRegionalCHN\",{},true)}",
                        props: {
                          model: "{formData.personData.personRegional.personRegionalCHN}",
                          labelPosition: "top",
                          span: 3,
                          inline: true,
                          items: [
                            {
                              type: "select",
                              props: {label: "国籍"},
                              itemProps: {
                                prop: "nationality",
                                optionsPath: "PERSON_REGIONAL_CHN.nationality"
                              }
                            },
                            {
                              type: "select",
                              props: {label: "性别"},
                              itemProps: {
                                prop: "gender",
                                optionsPath: "PERSON_REGIONAL_CHN.gender"
                              }
                            },
                            {
                              type: "select",
                              props: {label: "婚姻状态"},
                              itemProps: {
                                prop: "maritalStatus",
                                optionsPath: "PERSON_REGIONAL_CHN.maritalStatus"
                              }
                            },
                            {
                              type: "select",
                              props: {label: "民族"},
                              itemProps: {
                                prop: "ethnicity",
                                optionsPath: "PERSON_REGIONAL_CHN.ethnicity"
                              }
                            },
                            {
                              type: "select",
                              props: {label: "户口"},
                              itemProps: {
                                prop: "huKou",
                                optionsPath: "PERSON_REGIONAL_CHN.huKou"
                              }
                            },
                            {
                              type: "select",
                              props: {label: "政治面貌"},
                              itemProps: {
                                prop: "politicsStatus",
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
                    props: {"body-style": {padding: "20px 40px"}},
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
                            innerHTML: "姓名"
                          },
                          {
                            nodeType: "el-button",
                            scopeId: 2,
                            props: {
                              size: "mini",
                              type: "text"
                            },
                            class: "el-icon-plus",
                            on: {click: "{formData.personData.names.push({nameCHN:{},locale:locale.CHN.instanceId})}"}
                          }]
                      },
                      {
                        nodeType: "y-list",
                        props: {forList: "{formData.personData.names}"},
                        vInit: "{formData.personData.names=formData.personData.names||[]}",
                        // vInit: "{Utils.setEvalData(data,\"formData.personData.names\",[],true)}",
                        scopedSlots: {
                          default: [
                            {
                              nodeType: "el-row",
                              scopeMapping: {
                                itemModel: "item",
                                index: "index"
                              },
                              children: [
                                {
                                  nodeType: "el-row",
                                  props: {type: "flex"},
                                  style: {"justify-content": "flex-end"},
                                  children: [
                                    {
                                      nodeType: "el-button",
                                      props: {
                                        size: "mini",
                                        type: "text"
                                      },
                                      class: "el-icon-delete",
                                      on: {click: "{formData.personData.names.splice(index,1)}"}
                                    }]
                                },
                                {
                                  nodeType: "y-pre-form",
                                  props: {
                                    model: "{itemModel}",
                                    labelPosition: "top",
                                    span: 3,
                                    inline: true,
                                    items: [
                                      {
                                        props: {label: "类型"},
                                        type: "select",
                                        itemProps: {
                                          prop: "type",
                                          optionsPath: "NAME.type"
                                        }
                                      },
                                      {
                                        props: {label: "国家地区"},
                                        type: "select",
                                        itemProps: {
                                          prop: "locale",
                                          displayOnly: true,
                                          optionsPath: "LOCALE"
                                        }
                                      }
                                    ]
                                  }
                                }
                              ]
                            },
                            {
                              nodeType: "el-row",
                              scopeMapping: {
                                itemModel: "item",
                                index: "index"
                              },
                              vIf: "{!locale.CHN.instanceId||!itemModel.locale||(locale.CHN.instanceId===itemModel.locale)}",
                              vInit: "{itemModel.nameCHN=itemModel.nameCHN||{}}",
                              // vInit: "{Utils.setEvalData(data,\"itemModel.nameCHN\",{},true)}",
                              scopeId: 2,
                              children: [
                                {
                                  nodeType: "y-pre-form",
                                  props: {
                                    model: "{itemModel.nameCHN}",
                                    labelPosition: "top",
                                    span: 3,
                                    inline: true,
                                    items: [
                                      {
                                        type: "text",
                                        props: {label: "中文姓"},
                                        itemProps: {prop: "primaryFamilyName"}
                                      },
                                      {
                                        type: "text",
                                        props: {label: "中文中间名"},
                                        itemProps: {prop: "primaryMiddleName"}
                                      },
                                      {
                                        type: "text",
                                        props: {label: "中文名"},
                                        itemProps: {prop: "primaryGivenName"}
                                      },
                                      {
                                        type: "text",
                                        props: {label: "第二姓名的姓"},
                                        itemProps: {prop: "secondaryFamilyName"}
                                      },
                                      {
                                        type: "text",
                                        props: {label: "第二姓名的中间名"},
                                        itemProps: {prop: "secondaryMiddleName"}
                                      },
                                      {
                                        type: "text",
                                        props: {label: "第二姓名的名"},
                                        itemProps: {prop: "secondaryGivenName"}
                                      },
                                      {
                                        type: "text",
                                        props: {label: "第二姓名的姓"},
                                        itemProps: {prop: "tertiaryFamilyName"}
                                      },
                                      {
                                        type: "text",
                                        props: {label: "第三姓名的中间名"},
                                        itemProps: {prop: "tertiaryMiddleName"}
                                      },
                                      {
                                        type: "text",
                                        props: {label: "第三姓名的名"},
                                        itemProps: {prop: "tertiaryGivenName"}
                                      },
                                      {
                                        type: "text",
                                        props: {label: "昵称"},
                                        itemProps: {prop: "nickName"}
                                      },
                                      {
                                        type: "text",
                                        props: {label: "显示姓名"},
                                        itemProps: {prop: "displayName"}
                                      },
                                      {
                                        type: "text",
                                        props: {label: "头衔"},
                                        itemProps: {prop: "title"}
                                      }
                                    ]
                                  }
                                }
                              ]
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
                    vInit: "{formData.personData.identifiers=formData.personData.identifiers||[]}",
                    // vInit: "{Utils.setEvalData(data,\"formData.personData.identifiers\",[],true)}",
                    children: [
                      {
                        nodeType: "el-col",
                        children: [
                          {
                            nodeType: "el-card",
                            props: {"body-style": {padding: "20px 40px"}},
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
                                    nodeType: "el-button",
                                    props: {
                                      size: "mini",
                                      type: "text"
                                    },
                                    class: "el-icon-plus",
                                    on: {click: "{formData.personData.identifiers.push({})}"}
                                  }
                                ]
                              },
                              {
                                nodeType: "y-list",
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
                                      style: {"justify-content": "flex-end"},
                                      children: [
                                        {
                                          nodeType: "el-button",
                                          props: {
                                            size: "mini",
                                            type: "text"
                                          },
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
                                        span: 3,
                                        inline: true,
                                        items: [
                                          {
                                            type: "select",
                                            props: {label: "国家地区"},
                                            itemProps: {
                                              prop: "locale",
                                              optionsPath: "LOCALE"
                                            }
                                          },
                                          {
                                            type: "select",
                                            props: {label: "类型"},
                                            itemProps: {
                                              prop: "identificationType",
                                              optionsPath: "IDENTIFIER.identificationType"
                                            }
                                          },
                                          {
                                            type: "text",
                                            props: {label: "证件号"},
                                            itemProps: {prop: "identificationId"}
                                          },
                                          {
                                            type: "date",
                                            props: {label: "发证日期"},
                                            itemProps: {prop: "issuedDate"}
                                          },
                                          {
                                            type: "date",
                                            props: {label: "过期日期"},
                                            itemProps: {prop: "expirationDate"}
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
                    vInit: "{formData.personData.bankAccounts=formData.personData.bankAccounts||[]}",
                    // vInit: "{Utils.setEvalData(data,\"formData.personData.bankAccounts\",[],true)}",
                    children: [
                      {
                        nodeType: "el-col",
                        children: [
                          {
                            nodeType: "el-card",
                            props: {"body-style": {padding: "20px 40px"}},
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
                                    nodeType: "el-button",
                                    props: {
                                      size: "mini",
                                      type: "text"
                                    },
                                    class: "el-icon-plus",
                                    on: {click: "{formData.personData.bankAccounts.push({})}"}
                                  }
                                ]
                              },
                              {
                                nodeType: "y-list",
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
                                      style: {"justify-content": "flex-end"},
                                      children: [
                                        {
                                          nodeType: "el-button",
                                          props: {
                                            size: "mini",
                                            type: "text"
                                          },
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
                                        span: 3,
                                        inline: true,
                                        items: [
                                          {
                                            type: "select",
                                            props: {label: "国家地区"},
                                            itemProps: {
                                              prop: "locale",
                                              optionsPath: "LOCALE"
                                            }
                                          },
                                          {
                                            type: "select",
                                            props: {label: "类型"},
                                            itemProps: {
                                              prop: "type",
                                              optionsPath: "BANK_ACCOUNT.type"
                                            }
                                          },
                                          {
                                            type: "select",
                                            props: {label: "银行"},
                                            itemProps: {
                                              prop: "bank",
                                              optionsPath: "BANK"
                                            }
                                          },
                                          {
                                            type: "select",
                                            props: {label: "支行"},
                                            itemProps: {
                                              prop: "bankBranch",
                                              optionsPath: "BANK_BRANCH"
                                            }
                                          },
                                          {
                                            type: "text",
                                            props: {label: "账户名"},
                                            itemProps: {prop: "accountName"}
                                          },
                                          {
                                            type: "text",
                                            props: {label: "账户"},
                                            itemProps: {prop: "accountNumber"}
                                          }]
                                      }
                                    }]
                                }
                              }
                            
                            ]
                          }]
                      }]
                  },
                  //家庭成员以及社会关系
                  // {
                  // 	nodeType: "el-row", style: {margin: "20px 20px 0 20px"},
                  // 	vInit: "{formData.personData.familyDependents=formData.personData.familyDependents||[]}",
                  //// 	vInit: "{Utils.setEvalData(data,\"formData.personData.familyDependents\",[],true)}",
                  // 	children: [{
                  // 		nodeType: "el-col", children: [{
                  // 			nodeType: "el-card", props: {"body-style": {padding: "20px 40px"}},
                  // 			children: [
                  // 				{
                  // 					nodeType: "el-row", slot: "header", props: {type: "flex"}, style: {"align-items": "center"}, children: [
                  // 						{nodeType: "div", style: {flex: "auto"}, innerHTML: "家庭成员以及社会关系"},
                  // 						{
                  // 							nodeType: "el-button", props: {size: "mini", type: "text"}, class: "el-icon-plus",
                  // 							on: {click: "{formData.personData.familyDependents.push({})}"}
                  // 						}
                  // 					]
                  // 				},
                  // 				{
                  // 					nodeType: "y-list", props: {forList: "{formData.personData.familyDependents}"},
                  // 					scopedSlots: {
                  // 						default: [
                  // 							{
                  // 								nodeType: "el-row",
                  // 								scopeMapping: {itemModel: "item", index: "index"},
                  // 								props: {type: "flex"}, style: {"justify-content": "flex-end"}, children: [{
                  // 									nodeType: "el-button", props: {size: "mini", type: "text"}, class: "el-icon-delete",
                  // 									on: {click: "{formData.personData.familyDependents.splice(index,1)}"}
                  // 								}]
                  // 							},
                  // 							{
                  // 								nodeType: "y-pre-form", scopeMapping: {itemModel: "item"}, props: {
                  // 									model: "{itemModel}", labelPosition: "top", span: 3, inline: true, items: [
                  // 										{
                  // 											type: "select", prosp: {label: "关系"},
                  // 											itemProps: {prop: "relationship", optionsPath: "FAMILY_DEPENDENT.relationship"}
                  // 										},
                  // 										{
                  // 											type: "select", props: {label: "家庭成员以及社会关系人"},
                  // 											itemProps: {
                  // 												prop: "familyDependentPerson", optionsPath: "PERSON", remoteFilterKey: "names.nameCHN.displayName",
                  // 												labelKey: "$.names[?(@.locale[0].code==\"CHN\")].nameCHN[0].displayName"
                  // 											}
                  // 										}]
                  // 								}
                  // 							}]
                  // 					}
                  // 				}
                  // 			]
                  // 		}]
                  // 	}]
                  // },
                  // 地址
                  {
                    nodeType: "el-row",
                    style: {margin: "20px 20px 0 20px"},
                    children: [
                      {
                        nodeType: "el-col",
                        children: [
                          {
                            nodeType: "el-card",
                            props: {"body-style": {padding: "20px 40px"}},
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
                                    nodeType: "el-button",
                                    scopeId: 2,
                                    props: {
                                      size: "mini",
                                      type: "text"
                                    },
                                    class: "el-icon-plus",
                                    on: {click: "{formData.personData.addresses.push({locale:locale.CHN.instanceId})}"}
                                  }
                                ]
                              },
                              {
                                nodeType: "y-list",
                                props: {forList: "{formData.personData.addresses}"},
                                vInit: "{formData.personData.addresses=formData.personData.addresses||[]}",
                                // vInit: "{Utils.setEvalData(data,\"formData.personData.addresses\",[],true)}",
                                scopedSlots: {
                                  default: [
                                    {
                                      nodeType: "el-row",
                                      scopeMapping: {
                                        itemModel: "item",
                                        index: "index"
                                      },
                                      scopeId: 2,
                                      children: [
                                        {
                                          nodeType: "el-row",
                                          props: {type: "flex"},
                                          style: {"justify-content": "flex-end"},
                                          children: [
                                            {
                                              nodeType: "el-button",
                                              props: {
                                                size: "mini",
                                                type: "text"
                                              },
                                              class: "el-icon-delete",
                                              on: {click: "{formData.personData.addresses.splice(index,1)}"}
                                            }]
                                        },
                                        {
                                          nodeType: "y-pre-form",
                                          vInit: "{itemModel.addressCHN=itemModel.addressCHN||{}}",
                                          // vInit: "{Utils.setEvalData(data,\"itemModel.addressCHN\",{},true)}",
                                          props: {
                                            model: "{itemModel}",
                                            labelPosition: "top",
                                            span: 3,
                                            inline: true,
                                            items: [
                                              {
                                                type: "select",
                                                props: {label: "类型"},
                                                itemProps: {
                                                  prop: "type",
                                                  optionsPath: "ADDRESS.type"
                                                }
                                              },
                                              {
                                                type: "select",
                                                props: {label: "国家地区"},
                                                itemProps: {
                                                  prop: "locale",
                                                  displayOnly: true,
                                                  optionsPath: "LOCALE"
                                                }
                                              }]
                                          }
                                        }]
                                    },
                                    {
                                      nodeType: "el-row",
                                      scopeMapping: {
                                        itemModel: "item",
                                        index: "index"
                                      },
                                      vIf: "{!locale.CHN.instanceId||!itemModel.locale||(locale.CHN.instanceId===itemModel.locale)}",
                                      scopeId: 2,
                                      children: [
                                        {
                                          nodeType: "y-pre-form",
                                          props: {
                                            model: "{itemModel}",
                                            labelPosition: "top",
                                            span: 3,
                                            inline: true,
                                            items: [
                                              {
                                                type: "select",
                                                props: {label: "省市"},
                                                itemProps: {
                                                  prop: "addressCHN.region",
                                                  optionsPath: "REGION_CHN"
                                                }
                                              },
                                              {
                                                type: "select",
                                                props: {label: "城市"},
                                                itemProps: {
                                                  prop: "addressCHN.city",
                                                  optionsPath: "CITY_CHN"
                                                }
                                              },
                                              {
                                                type: "select",
                                                props: {label: "地区"},
                                                itemProps: {
                                                  prop: "addressCHN.district",
                                                  optionsPath: "DISTRICT_CHN"
                                                }
                                              },
                                              {
                                                type: "select",
                                                props: {label: "子地区"},
                                                itemProps: {
                                                  prop: "addressCHN.subDistrict",
                                                  optionsPath: "SUBDISTRICT_CHN"
                                                }
                                              },
                                              {
                                                type: "text",
                                                props: {label: "地址"},
                                                itemProps: {prop: "addressCHN.address1"}
                                              },
                                              {
                                                type: "text",
                                                props: {label: "邮政"},
                                                itemProps: {prop: "addressCHN.postal"}
                                              }
                                            ]
                                          }
                                        }]
                                    }
                                    // {
                                    // 	nodeType: "el-row",
                                    // 	scopeMapping: {itemModel: "item", index: "index"},
                                    // 	vIf: "{!!(locale.CHN.instanceId&&itemModel.locale&&(locale.CHN.instanceId!==itemModel.locale))}",
                                    // 	scopeId: 2,
                                    // 	children: [{
                                    // 		nodeType: "y-pre-form",
                                    // 		props: {
                                    // 			model: "{itemModel}",
                                    // 			labelPosition: "top",
                                    // 			span: 3,
                                    // 			inline: true,
                                    // 			items: [
                                    // 				{type: "text", props: {label: "州"}, itemProps: {prop: "addressCHN.prop1"}},
                                    // 				{type: "text", props: {label: "县"}, itemProps: {prop: "addressCHN.prop2"}},
                                    // 				{type: "text", props: {label: "郡"}, itemProps: {prop: "addressCHN.prop3"}},
                                    // 				{type: "text", props: {label: "邮编"}, itemProps: {prop: "addressCHN.postal"}},
                                    // 				{type: "text", props: {label: "地址"}, itemProps: {prop: "addressCHN.address1"}}
                                    // 			]
                                    // 		}
                                    // 	}]
                                    // }
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
                    vInit: "{formData.personData.phones=formData.personData.phones||[]}",
                    // vInit: "{Utils.setEvalData(data,\"formData.personData.phones\",[],true)}",
                    children: [
                      {
                        nodeType: "el-col",
                        children: [
                          {
                            nodeType: "el-card",
                            props: {"body-style": {padding: "20px 40px"}},
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
                                    nodeType: "el-button",
                                    props: {
                                      size: "mini",
                                      type: "text"
                                    },
                                    class: "el-icon-plus",
                                    on: {click: "{formData.personData.phones.push({})}"}
                                  }
                                ]
                              },
                              {
                                nodeType: "y-list",
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
                                      style: {"justify-content": "flex-end"},
                                      children: [
                                        {
                                          nodeType: "el-button",
                                          props: {
                                            size: "mini",
                                            type: "text"
                                          },
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
                                        span: 3,
                                        inline: true,
                                        items: [
                                          {
                                            type: "select",
                                            props: {label: "类型"},
                                            itemProps: {
                                              prop: "type",
                                              optionsPath: "PHONE.type"
                                            }
                                          },
                                          {
                                            type: "select",
                                            props: {label: "国家地区"},
                                            itemProps: {
                                              prop: "locale",
                                              optionsPath: "LOCALE"
                                            }
                                          },
                                          {
                                            type: "text",
                                            props: {label: "国际冠码"},
                                            itemProps: {prop: "interPrefix"}
                                          },
                                          {
                                            type: "text",
                                            props: {label: "长途字冠"},
                                            itemProps: {prop: "trunkPrefix"}
                                          },
                                          {
                                            type: "text",
                                            props: {label: "号码"},
                                            itemProps: {prop: "phoneNumber"}
                                          },
                                          {
                                            type: "text",
                                            props: {label: "分机"},
                                            itemProps: {prop: "extension"}
                                          }]
                                      }
                                    }]
                                }
                              }]
                          }]
                      }]
                  },
                  //邮箱
                  {
                    nodeType: "el-row",
                    style: {margin: "20px 20px 0 20px"},
                    vInit: "{formData.personData.emails=formData.personData.emails||[]}",
                    // vInit: "{Utils.setEvalData(data,\"formData.personData.emails\",[],true)}",
                    children: [
                      {
                        nodeType: "el-col",
                        children: [
                          {
                            nodeType: "el-card",
                            props: {"body-style": {padding: "20px 40px"}},
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
                                    nodeType: "el-button",
                                    props: {
                                      size: "mini",
                                      type: "text"
                                    },
                                    class: "el-icon-plus",
                                    on: {click: "{formData.personData.emails.push({})}"}
                                  }
                                ]
                              },
                              {
                                nodeType: "y-list",
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
                                      style: {"justify-content": "flex-end"},
                                      children: [
                                        {
                                          nodeType: "el-button",
                                          props: {
                                            size: "mini",
                                            type: "text"
                                          },
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
                                        span: 3,
                                        inline: true,
                                        items: [
                                          {
                                            type: "select",
                                            props: {label: "类型"},
                                            itemProps: {
                                              prop: "type",
                                              optionsPath: "EMAIL.type"
                                            }
                                          },
                                          {
                                            type: "text",
                                            props: {label: "邮箱"},
                                            itemProps: {prop: "email"}
                                          }]
                                      }
                                    }]
                                }
                              }]
                          }]
                      }]
                  },
                  //紧急联系人
                  // {
                  // 	nodeType: "el-row", style: {margin: "20px 20px 0 20px"},
                  // 	vInit: "{formData.personData.emergencyContacts=formData.personData.emergencyContacts||[]}",
                  //// 	vInit: "{Utils.setEvalData(data,\"formData.personData.emergencyContacts\",[],true)}",
                  // 	children: [{
                  // 		nodeType: "el-col", children: [{
                  // 			nodeType: "el-card", props: {"body-style": {padding: "20px 40px"}},
                  // 			children: [
                  // 				{
                  // 					nodeType: "el-row", slot: "header", props: {type: "flex"}, style: {"align-items": "center"}, children: [
                  // 						{nodeType: "div", style: {flex: "auto"}, innerHTML: "紧急联系人"},
                  // 						{
                  // 							nodeType: "el-button", props: {size: "mini", type: "text"}, class: "el-icon-plus",
                  // 							on: {click: "{formData.personData.emergencyContacts.push({})}"}
                  // 						}]
                  // 				},
                  // 				{
                  // 					nodeType: "y-list", props: {forList: "{formData.personData.emergencyContacts}"},
                  // 					scopedSlots: {
                  // 						default: [
                  // 							{
                  // 								nodeType: "el-row", scopeMapping: {itemModel: "item", index: "index"}, props: {type: "flex"},
                  // 								style: {"justify-content": "flex-end"}, children: [{
                  // 									nodeType: "el-button", props: {size: "mini", type: "text"}, class: "el-icon-delete",
                  // 									on: {click: "{formData.personData.emergencyContacts.splice(index,1)}"}
                  // 								}]
                  // 							},
                  // 							{
                  // 								nodeType: "y-pre-form", scopeMapping: {itemModel: "item"}, props: {
                  // 									model: "{itemModel}", labelPosition: "top", span: 3, inline: true, items: [
                  // 										{
                  // 											type: "select", props: {label: "关系"},
                  // 											itemProps: {prop: "relationship", optionsPath: "EMERGENCY_CONTACT.relationship"}
                  // 										},
                  // 										{
                  // 											type: "select", props: {label: "紧急联系人"}, itemProps: {
                  // 												prop: "emergencyContactPerson", optionsPath: "PERSON", remoteFilterKey: "names.nameCHN.displayName",
                  // 												labelKey: "$.names[?(@.locale[0].code==\"CHN\")].nameCHN[0].displayName"
                  // 											}
                  // 										}]
                  // 								}
                  // 							}]
                  // 					}
                  // 				}]
                  // 		}]
                  // 	}]
                  // },
                  //其他联系方式
                  {
                    nodeType: "el-row",
                    style: {margin: "20px 20px 0 20px"},
                    vInit: "{formData.personData.otherContacts=formData.personData.otherContacts||[]}",
                    // vInit: "{Utils.setEvalData(data,\"formData.personData.otherContacts\",[],true)}",
                    children: [
                      {
                        nodeType: "el-col",
                        children: [
                          {
                            nodeType: "el-card",
                            props: {"body-style": {padding: "20px 40px"}},
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
                                    nodeType: "el-button",
                                    props: {
                                      size: "mini",
                                      type: "text"
                                    },
                                    class: "el-icon-plus",
                                    on: {click: "{formData.personData.otherContacts.push({})}"}
                                  }]
                              },
                              {
                                nodeType: "y-list",
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
                                      style: {"justify-content": "flex-end"},
                                      children: [
                                        {
                                          nodeType: "el-button",
                                          props: {
                                            size: "mini",
                                            type: "text"
                                          },
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
                                        span: 3,
                                        inline: true,
                                        items: [
                                          {
                                            type: "select",
                                            props: {label: "类型"},
                                            itemProps: {
                                              prop: "otherContactType",
                                              optionsPath: "OTHER_CONTACT.otherContactType"
                                            }
                                          },
                                          {
                                            type: "text",
                                            props: {label: "其他联系方式ID"},
                                            itemProps: {prop: "otherContactId"}
                                          }
                                        ]
                                      }
                                    }]
                                }
                              }]
                          }]
                      }]
                  },
                  //雇佣信息
                  {
                    nodeType: "el-row",
                    style: {margin: "20px 20px 0 20px"},
                    vInit: "{formData.employeeData.employment=formData.employeeData.employment||{}}",
                    // vInit: "{Utils.setEvalData(data,\"formData.employeeData.employment\",{},true)}",
                    children: [
                      {
                        nodeType: "el-col",
                        children: [
                          {
                            nodeType: "el-card",
                            props: {"body-style": {padding: "20px 40px"}},
                            children: [
                              {
                                nodeType: "el-row",
                                slot: "header",
                                props: {type: "flex"},
                                children: [
                                  {
                                    nodeType: "div",
                                    style: {flex: "auto"},
                                    innerHTML: "雇佣信息"
                                  }]
                              },
                              {
                                nodeType: "y-pre-form",
                                props: {
                                  model: "{formData.employeeData.employment}",
                                  labelPosition: "top",
                                  span: 3,
                                  inline: true,
                                  items: [
                                    {
                                      type: "text",
                                      props: {label: "雇佣工号"},
                                      itemProps: {prop: "employeeId"}
                                    },
                                    {
                                      type: "select",
                                      props: {label: "雇佣类型"},
                                      itemProps: {
                                        prop: "employmentType",
                                        optionsPath: "EMPLOYMENT.employmentType"
                                      }
                                    },
                                    {
                                      type: "select",
                                      props: {label: "雇佣状态"},
                                      itemProps: {
                                        prop: "employmentStatus",
                                        optionsPath: "EMPLOYMENT.employmentStatus"
                                      }
                                    }
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
                    vInit: "{formData.employeeData.workRelationships=formData.employeeData.workRelationships||[]}",
                    // vInit: "{Utils.setEvalData(data,\"formData.employeeData.workRelationships\",[],true)}",
                    children: [
                      {
                        nodeType: "el-col",
                        children: [
                          {
                            nodeType: "el-card",
                            props: {"body-style": {padding: "20px 40px"}},
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
                                    innerHTML: "劳动关系"
                                  },
                                  {
                                    nodeType: "el-button",
                                    props: {
                                      size: "mini",
                                      type: "text"
                                    },
                                    class: "el-icon-plus",
                                    on: {click: "{formData.employeeData.workRelationships.push({})}"}
                                  }]
                              },
                              {
                                nodeType: "y-list",
                                props: {forList: "{formData.employeeData.workRelationships}"},
                                scopedSlots: {
                                  default: [
                                    {
                                      nodeType: "el-row",
                                      scopeMapping: {
                                        itemModel: "item",
                                        index: "index"
                                      },
                                      props: {type: "flex"},
                                      style: {"justify-content": "flex-end"},
                                      children: [
                                        {
                                          nodeType: "el-button",
                                          props: {
                                            size: "mini",
                                            type: "text"
                                          },
                                          class: "el-icon-delete",
                                          on: {click: "{formData.employeeData.workRelationships.splice(index,1)}"}
                                        }]
                                    },
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
                                              prop: "assignmentType",
                                              optionsPath: "WORK_RELATIONSHIPS.assignmentType"
                                            }
                                          },
                                          {
                                            type: "text",
                                            props: {label: "劳动关系ID"},
                                            itemProps: {prop: "workRelationshipId"}
                                          },
                                          {
                                            type: "select",
                                            props: {label: "劳动关系类型"},
                                            itemProps: {
                                              prop: "workRelationshipType",
                                              optionsPath: "WORK_RELATIONSHIPS.workRelationshipType"
                                            }
                                          },
                                          {
                                            type: "select",
                                            props: {label: "劳动关系状态"},
                                            itemProps: {
                                              prop: "workRelationshipStatus",
                                              optionsPath: "WORK_RELATIONSHIPS.workRelationshipStatus"
                                            }
                                          },
                                          {
                                            type: "date",
                                            props: {label: "入职日期"},
                                            itemProps: {prop: "hireDate"}
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
                    vInit: "{formData.employeeData.contracts=formData.employeeData.contracts||[]}",
                    // vInit: "{Utils.setEvalData(data,\"formData.employeeData.contracts\",[],true)}",
                    children: [
                      {
                        nodeType: "el-col",
                        children: [
                          {
                            nodeType: "el-card",
                            props: {"body-style": {padding: "20px 40px"}},
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
                                  },
                                  {
                                    nodeType: "el-button",
                                    props: {
                                      size: "mini",
                                      type: "text"
                                    },
                                    class: "el-icon-plus",
                                    on: {click: "{formData.employeeData.contracts.push({})}"}
                                  }]
                              },
                              {
                                nodeType: "y-list",
                                props: {forList: "{formData.employeeData.contracts}"},
                                scopedSlots: {
                                  default: [
                                    {
                                      nodeType: "el-row",
                                      scopeMapping: {
                                        itemModel: "item",
                                        index: "index"
                                      },
                                      props: {type: "flex"},
                                      style: {"justify-content": "flex-end"},
                                      children: [
                                        {
                                          nodeType: "el-button",
                                          props: {
                                            size: "mini",
                                            type: "text"
                                          },
                                          class: "el-icon-delete",
                                          on: {click: "{formData.employeeData.contracts.splice(index,1)}"}
                                        }]
                                    },
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
                                            props: {label: "类型"},
                                            itemProps: {
                                              prop: "type",
                                              optionsPath: "CONTRACTS.type"
                                            }
                                          },
                                          {
                                            type: "date",
                                            props: {label: "开始日期"},
                                            itemProps: {prop: "startDate"}
                                          },
                                          {
                                            type: "date",
                                            props: {label: "结束日期"},
                                            itemProps: {prop: "endDate"}
                                          }
                                        ]
                                      }
                                    }]
                                }
                              }]
                          }]
                      }]
                  },
                  //职位
                  {
                    nodeType: "el-row",
                    style: {margin: "20px 20px 0 20px"},
                    vInit: "{formData.employeeData.positions=formData.employeeData.positions||[]}",
                    // vInit: "{Utils.setEvalData(data,\"formData.employeeData.positions\",[],true)}",
                    children: [
                      {
                        nodeType: "el-col",
                        children: [
                          {
                            nodeType: "el-card",
                            props: {"body-style": {padding: "20px 40px"}},
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
                                  },
                                  {
                                    nodeType: "el-button",
                                    props: {
                                      size: "mini",
                                      type: "text"
                                    },
                                    class: "el-icon-plus",
                                    on: {click: "{formData.employeeData.positions.push({})}"}
                                  }]
                              },
                              {
                                nodeType: "y-list",
                                props: {forList: "{formData.employeeData.positions}"},
                                scopedSlots: {
                                  default: [
                                    {
                                      nodeType: "el-row",
                                      scopeMapping: {
                                        itemModel: "item",
                                        index: "index"
                                      },
                                      props: {type: "flex"},
                                      style: {"justify-content": "flex-end"},
                                      children: [
                                        {
                                          nodeType: "el-button",
                                          props: {
                                            size: "mini",
                                            type: "text"
                                          },
                                          class: "el-icon-delete",
                                          on: {click: "{formData.employeeData.positions.splice(index,1)}"}
                                        }]
                                    },
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
                                              prop: "assignmentType",
                                              optionsPath: "POSITIONS.assignmentType"
                                            }
                                          },
                                          {
                                            type: "select",
                                            props: {label: "职位"},
                                            itemProps: {
                                              prop: "position",
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
                    vInit: "{formData.employeeData.jobs=formData.employeeData.jobs||[]}",
                    // vInit: "{Utils.setEvalData(data,\"formData.employeeData.jobs\",[],true)}",
                    children: [
                      {
                        nodeType: "el-col",
                        children: [
                          {
                            nodeType: "el-card",
                            props: {"body-style": {padding: "20px 40px"}},
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
                                    innerHTML: "职务"
                                  },
                                  {
                                    nodeType: "el-button",
                                    props: {
                                      size: "mini",
                                      type: "text"
                                    },
                                    class: "el-icon-plus",
                                    on: {click: "{formData.employeeData.jobs.push({})}"}
                                  }]
                              },
                              {
                                nodeType: "y-list",
                                props: {forList: "{formData.employeeData.jobs}"},
                                scopedSlots: {
                                  default: [
                                    {
                                      nodeType: "el-row",
                                      scopeMapping: {
                                        itemModel: "item",
                                        index: "index"
                                      },
                                      props: {type: "flex"},
                                      style: {"justify-content": "flex-end"},
                                      children: [
                                        {
                                          nodeType: "el-button",
                                          props: {
                                            size: "mini",
                                            type: "text"
                                          },
                                          class: "el-icon-delete",
                                          on: {click: "{formData.employeeData.jobs.splice(index,1)}"}
                                        }]
                                    },
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
                                              prop: "assignmentType",
                                              optionsPath: "JOBS.assignmentType"
                                            }
                                          },
                                          {
                                            type: "select",
                                            props: {label: "职务"},
                                            itemProps: {
                                              prop: "job",
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
                    vInit: "{formData.employeeData.managementLevels=formData.employeeData.managementLevels||[]}",
                    // vInit: "{Utils.setEvalData(data,\"formData.employeeData.managementLevels\",[],true)}",
                    children: [
                      {
                        nodeType: "el-col",
                        children: [
                          {
                            nodeType: "el-card",
                            props: {"body-style": {padding: "20px 40px"}},
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
                                  },
                                  {
                                    nodeType: "el-button",
                                    props: {
                                      size: "mini",
                                      type: "text"
                                    },
                                    class: "el-icon-plus",
                                    on: {click: "{formData.employeeData.managementLevels.push({})}"}
                                  }]
                              },
                              {
                                nodeType: "y-list",
                                props: {forList: "{formData.employeeData.managementLevels}"},
                                scopedSlots: {
                                  default: [
                                    {
                                      nodeType: "el-row",
                                      scopeMapping: {
                                        itemModel: "item",
                                        index: "index"
                                      },
                                      props: {type: "flex"},
                                      style: {"justify-content": "flex-end"},
                                      children: [
                                        {
                                          nodeType: "el-button",
                                          props: {
                                            size: "mini",
                                            type: "text"
                                          },
                                          class: "el-icon-delete",
                                          on: {click: "{formData.employeeData.managementLevels.splice(index,1)}"}
                                        }]
                                    },
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
                                              prop: "assignmentType",
                                              optionsPath: "MANAGEMENT_LEVELS.assignmentType"
                                            }
                                          },
                                          {
                                            type: "select",
                                            props: {label: "职级"},
                                            itemProps: {
                                              prop: "managementLevel",
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
                    vInit: "{formData.employeeData.organizations=formData.employeeData.organizations||[]}",
                    // vInit: "{Utils.setEvalData(data,\"formData.employeeData.organizations\",[],true)}",
                    children: [
                      {
                        nodeType: "el-col",
                        children: [
                          {
                            nodeType: "el-card",
                            props: {"body-style": {padding: "20px 40px"}},
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
                                    innerHTML: "组织信息"
                                  },
                                  {
                                    nodeType: "el-button",
                                    props: {
                                      size: "mini",
                                      type: "text"
                                    },
                                    class: "el-icon-plus",
                                    on: {click: "{formData.employeeData.organizations.push({})}"}
                                  }]
                              },
                              {
                                nodeType: "y-list",
                                props: {forList: "{formData.employeeData.organizations}"},
                                scopedSlots: {
                                  default: [
                                    {
                                      nodeType: "el-row",
                                      scopeMapping: {
                                        itemModel: "item",
                                        index: "index"
                                      },
                                      props: {type: "flex"},
                                      style: {"justify-content": "flex-end"},
                                      children: [
                                        {
                                          nodeType: "el-button",
                                          props: {
                                            size: "mini",
                                            type: "text"
                                          },
                                          class: "el-icon-delete",
                                          on: {click: "{formData.employeeData.organizations.splice(index,1)}"}
                                        }]
                                    },
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
                                            props: {label: "组织类型"},
                                            itemProps: {
                                              prop: "type",
                                              optionsPath: "ORGANIZATIONS.type"
                                            }
                                          },
                                          {
                                            type: "select",
                                            props: {label: "分配类型"},
                                            itemProps: {
                                              prop: "assignmentType",
                                              optionsPath: "ORGANIZATIONS.assignmentType"
                                            }
                                          },
                                          {
                                            type: "select",
                                            props: {label: "组织"},
                                            itemProps: {
                                              prop: "organization",
                                              optionsPath: "ORGANIZATION"
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
                    vInit: "{formData.employeeData.managers=formData.employeeData.managers||[]}",
                    // vInit: "{Utils.setEvalData(data,\"formData.employeeData.managers\",[],true)}",
                    children: [
                      {
                        nodeType: "el-col",
                        children: [
                          {
                            nodeType: "el-card",
                            props: {"body-style": {padding: "20px 40px"}},
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
                                    nodeType: "el-button",
                                    props: {
                                      size: "mini",
                                      type: "text"
                                    },
                                    class: "el-icon-plus",
                                    on: {click: "{formData.employeeData.managers.push({})}"}
                                  }]
                              },
                              {
                                nodeType: "y-list",
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
                                      style: {"justify-content": "flex-end"},
                                      children: [
                                        {
                                          nodeType: "el-button",
                                          props: {
                                            size: "mini",
                                            type: "text"
                                          },
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
                                        span: 3,
                                        inline: true,
                                        items: [
                                          {
                                            type: "select",
                                            props: {label: "类型"},
                                            itemProps: {
                                              prop: "type",
                                              optionsPath: "MANAGERS.type"
                                            }
                                          },
                                          {
                                            type: "select",
                                            props: {label: "主管"},
                                            itemProps: {
                                              prop: "manager",
                                              optionsPath: "EMPLOYEE",
                                              labelKey: "$.personal[0].names[?(@.locale[0].code==\"CHN\")].nameCHN[0].displayName",
                                              remoteFilterKey: "personal.names.nameCHN.displayName"
                                            }
                                          }]
                                      }
                                    }]
                                }
                              }]
                          }]
                      }]
                  },
                  // 薪酬信息
                  {
                    nodeType: "el-row",
                    style: {margin: "20px 20px 0 20px"},
                    vInit: "{formData.employeeData.compensation=formData.employeeData.compensation||{}}",
                    // vInit: "{Utils.setEvalData(data,\"formData.employeeData.compensation\",{},true)}",
                    children: [
                      {
                        nodeType: "el-col",
                        children: [
                          {
                            nodeType: "el-card",
                            props: {"body-style": {padding: "20px 40px"}},
                            children: [
                              {
                                nodeType: "el-row",
                                slot: "header",
                                props: {type: "flex"},
                                children: [
                                  {
                                    nodeType: "div",
                                    style: {flex: "auto"},
                                    innerHTML: "薪酬信息"
                                  }]
                              },
                              {
                                nodeType: "y-pre-form",
                                props: {
                                  model: "{formData.employeeData.compensation}",
                                  labelPosition: "top",
                                  span: 3,
                                  inline: true,
                                  items: [
                                    {
                                      type: "select",
                                      props: {label: "薪等"},
                                      itemProps: {
                                        prop: "grade",
                                        optionsPath: "COMPENSATION.grade"
                                      }
                                    },
                                    {
                                      type: "select",
                                      props: {label: "薪级"},
                                      itemProps: {
                                        prop: "step",
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
                    vInit: "{formData.employeeData.payComponents=formData.employeeData.payComponents||[]}",
                    // vInit: "{Utils.setEvalData(data,\"formData.employeeData.payComponents\",[],true)}",
                    children: [
                      {
                        nodeType: "el-col",
                        children: [
                          {
                            nodeType: "el-card",
                            props: {"body-style": {padding: "20px 40px"}},
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
                                    nodeType: "el-button",
                                    props: {
                                      size: "mini",
                                      type: "text"
                                    },
                                    class: "el-icon-plus",
                                    on: {click: "{formData.employeeData.payComponents.push({})}"}
                                  }]
                              },
                              {
                                nodeType: "y-list",
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
                                      style: {"justify-content": "flex-end"},
                                      children: [
                                        {
                                          nodeType: "el-button",
                                          props: {
                                            size: "mini",
                                            type: "text"
                                          },
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
                                        span: 3,
                                        inline: true,
                                        items: [
                                          {
                                            type: "select",
                                            props: {label: "薪酬项"},
                                            itemProps: {
                                              prop: "payComponent",
                                              optionsPath: "PAY_COMPONENTS.payComponent"
                                            }
                                          },
                                          {
                                            type: "select",
                                            props: {label: "货币"},
                                            itemProps: {
                                              prop: "currency",
                                              optionsPath: "CURRENCY"
                                            }
                                          },
                                          {
                                            type: "number",
                                            props: {label: "值"},
                                            itemProps: {
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
                  },
                  // 支付信息
                  // {
                  // 	nodeType: "el-row", style: {margin: "20px 20px 0 20px"},
                  // 	vInit: "{formData.employeeData.payments=formData.employeeData.payments||[]}",
                  //// 	vInit: "{Utils.setEvalData(data,\"formData.employeeData.payments\",[],true)}",
                  // 	children: [{
                  // 		nodeType: "el-col", children: [{
                  // 			nodeType: "el-card", props: {"body-style": {padding: "20px 40px"}},
                  // 			children: [
                  // 				{
                  // 					nodeType: "el-row", slot: "header", props: {type: "flex"}, style: {"align-items": "center"}, children: [
                  // 						{nodeType: "div", style: {flex: "auto"}, innerHTML: "支付信息"},
                  // 						{
                  // 							nodeType: "el-button", props: {size: "mini", type: "text"}, class: "el-icon-plus",
                  // 							on: {click: "{formData.employeeData.payments.push({})}"}
                  // 						}]
                  // 				},
                  // 				{
                  // 					nodeType: "y-list", props: {forList: "{formData.employeeData.payments}"},
                  // 					scopedSlots: {
                  // 						default: [
                  // 							{
                  // 								nodeType: "el-row", scopeMapping: {itemModel: "item", index: "index"}, props: {type: "flex"},
                  // 								style: {"justify-content": "flex-end"}, children: [{
                  // 									nodeType: "el-button", props: {size: "mini", type: "text"}, class: "el-icon-delete",
                  // 									on: {click: "{formData.employeeData.payments.splice(index,1)}"}
                  // 								}]
                  // 							},
                  // 							{
                  // 								nodeType: "y-pre-form", scopeMapping: {itemModel: "item"}, props: {
                  // 									model: "{itemModel}", labelPosition: "top", span: 3, inline: true, items: [
                  // 										{type: "select",props:{label: "支付类型"}, itemProps:{prop: "paymentType", optionsPath: "PAYMENTS.paymentType"}},
                  // 										{type: "select",props:{label: "国家地区"}, itemProps:{prop: "locale", optionsPath: "LOCALE"}},
                  // 										{type: "select",props:{label: "银行卡号"}, itemProps:{prop: "bankAccount", optionsPath: "PAYMENTS.bankAccount"}},
                  // 										{type: "select",props:{label: "货币"}, itemProps:{prop: "currency", optionsPath: "CURRENCY"}}]
                  // 								}
                  // 							}]
                  // 					}
                  // 				}]
                  // 		}]
                  // 	}]
                  // },
                  
                  {
                    nodeType: "el-row",
                    style: {margin: "20px 20px 0 20px"},
                    children: [
                      {
                        nodeType: "el-col",
                        children: [
                          {
                            nodeType: "el-card",
                            props: {"body-style": {padding: "20px 40px"}},
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
                                          type: "primary",
                                          "formSubmit": true
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
                  }]
              }
            ]
          }
        ]
      };
    }
  }
});
