export default () => ({
  namespaced: true,
  state: {
    scopeData: {},
    nodes: [
      {
        "id": "0",
        "type": "y-container",
        "props": {"direction": "vertical"}
      },
      {
        "id": "0-0",
        "type": "y-html",
        "tag": "div",
        "class": "header-part page-header corehr-header"
      },
      {
        "id": "0-0-0",
        "type": "y-button",
        "props": {"type": "text"},
        "eval": {"on.click.function": "eventHandle.back"}
      },
      {
        "id": "0-0-0-0",
        "type": "y-html",
        "tag": "i",
        "class": "el-icon-arrow-left"
      },
      {
        "id": "0-0-1",
        "type": "y-html",
        "tag": "h2",
        "style": {"margin-left": "0 !important"}
      },
      
      {
        "id": "0-0-1-0",
        "type": "y-html",
        "tag": "span",
        "text": "Organization for "
      },
      {
        "id": "0-0-1-1",
        "type": "y-html",
        "tag": "span",
        "eval": {"text": "detailData.name"}
      },
      {
        "id": "0-0-2",
        "type": "y-html",
        "tag": "div"
      },
      {
        "id": "0-0-2-0",
        "type": "y-html",
        "tag": "span",
        "style": {"margin-left": "20px"},
        "text": "As Of Date"
      },
      {
        "id": "0-0-2-1",
        "type": "y-html",
        "tag": "span",
        "style": {"margin": "0 20px"},
        "eval": {"text": "asOfDate"}
      },
      {
        "id": "0-0-3",
        "type": "y-button",
        "text": "Save",
        "props": {"type": "primary"},
        "eval": {"on.click.function": "eventHandle.submit"}
      },
      {
        "id": "0-1",
        "type": "y-main"
      },
      {
        "id": "0-1-0",
        "type": "y-container",
        "style": {
          "flex": "auto",
          "padding": "20px"
        }
      },
      {
        "id": "0-1-0-0",
        "type": "y-card",
        "style": {
          "flex": "auto",
          "margin-right": "20px"
        }
      },
      {
        "id": "0-1-0-0-0",
        "type": "y-form",
        "props": {
          "size": "mini",
          "label-width": "180px",
          "label-position": "left",
          "disabled": true
        },
        "eval": {"props.model": "detailData"}
      },
      {
        "id": "0-1-0-0-0-0",
        "type": "y-form-item",
        "props": {
          "label": "Id",
          "prop": "id"
        }
      },
      {
        "id": "0-1-0-0-0-0-0",
        "type": "y-input",
        "modelKey": "detailData.id"
      },
      
      {
        "id": "0-1-0-0-0-1",
        "type": "y-form-item",
        "props": {
          "label": "External ID",
          "prop": "externalId"
        }
      },
      {
        "id": "0-1-0-0-0-1-0",
        "type": "y-input",
        "modelKey": "detailData.externalId"
      },
      
      {
        "id": "0-1-0-0-1",
        "type": "y-tabs"
      },
      {
        "id": "0-1-0-0-1-0",
        "type": "y-tab-pane",
        "props": {"label": "Detail"}
      },
      
      {
        "id": "0-1-0-0-1-0-0",
        "type": "y-form",
        "props": {
          "size": "mini",
          "label-width": "180px",
          "label-position": "left"
        },
        "eval": {"props.model": "detailData"}
      },
      {
        "id": "0-1-0-0-1-0-0-0",
        "type": "y-form-item",
        "props": {
          "label": "Effective Start Date",
          "prop": "effectiveDate"
        }
      },
      {
        "id": "0-1-0-0-1-0-0-0-0",
        "type": "y-date-picker",
        "initialExitNotChangeable": true,
        "props": {"value-format": "yyyyMMdd"},
        "modelKey": "detailData.effectiveDate"
      },
      {
        "id": "0-1-0-0-1-0-0-1",
        "type": "y-form-item",
        "props": {
          "label": "Code",
          "prop": "code"
        }
      },
      {
        "id": "0-1-0-0-1-0-0-1-0",
        "type": "y-input",
        "modelKey": "detailData.code"
      },
      {
        "id": "0-1-0-0-1-0-0-2",
        "type": "y-form-item",
        "props": {
          "label": "Status",
          "prop": "status"
        }
      },
      {
        "id": "0-1-0-0-1-0-0-2-0",
        "type": "y-pagination-select",
        "props": {"clearable": true},
        "optionsPath": "ORGANIZATION.status",
        "modelKey": "detailData.status",
        "optionValueKey": "code",
        "optionLabelKey": "name"
      },
      {
        "id": "0-1-0-0-1-0-0-3",
        "type": "y-form-item",
        "props": {
          "label": "Type",
          "prop": "type"
        }
      },
      {
        "id": "0-1-0-0-1-0-0-3-0",
        "type": "y-pagination-select",
        "props": {"clearable": true},
        "optionsPath": "ORGANIZATION.type",
        "modelKey": "detailData.type",
        "optionValueKey": "code",
        "optionLabelKey": "name"
      },
      {
        "id": "0-1-0-0-1-0-0-4",
        "type": "y-form-item",
        "props": {
          "label": "SubType",
          "prop": "subType"
        }
      },
      {
        "id": "0-1-0-0-1-0-0-4-0",
        "type": "y-pagination-select",
        "props": {"clearable": true},
        "optionsPath": "ORGANIZATION.subType",
        "modelKey": "detailData.subType",
        "optionValueKey": "code",
        "optionLabelKey": "name"
      },
      {
        "id": "0-1-0-0-1-0-0-5",
        "type": "y-form-item",
        "props": {
          "label": "Name",
          "prop": "name"
        }
      },
      {
        "id": "0-1-0-0-1-0-0-5-0",
        "type": "y-input",
        "modelKey": "detailData.name"
      },
      {
        "id": "0-1-0-0-1-0-0-6",
        "type": "y-form-item",
        "props": {
          "label": "Description",
          "prop": "description"
        }
      },
      {
        "id": "0-1-0-0-1-0-0-6-0",
        "type": "y-input",
        "modelKey": "detailData.description"
      },
      {
        "id": "0-1-0-0-1-0-0-7",
        "type": "y-form-item",
        "props": {
          "label": "Superior",
          "prop": "superior"
        }
      },
      {
        "id": "0-1-0-0-1-0-0-7-0",
        "type": "y-pagination-select",
        "param": {},
        "eval": {"param.asOfDate": "asOfDate"},
        "optionsPath": "ORGANIZATION",
        "modelKey": "detailData.superior[0]",
        "props": {
          "clearable": true,
          "value-key": "instanceId"
        },
        "optionLabelKey": "name"
      },
      {
        "id": "0-1-0-0-1-0-0-8",
        "type": "y-form-item",
        "props": {
          "label": "Manager",
          "prop": "manager"
        }
      },
      {
        "id": "0-1-0-0-1-0-0-8-0",
        "type": "y-pagination-select",
        "param": {},
        "eval": {"param.asOfDate": "asOfDate"},
        "optionsPath": "EMPLOYEE",
        "modelKey": "detailData.manager[0]",
        "props": {
          "clearable": true,
          "value-key": "instanceId"
        },
        "optionLabelKey": "code"
      }
    
    ]
  }
});
