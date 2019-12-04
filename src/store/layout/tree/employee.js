export const EMPLOYEE = {
  namespaced: true,
  state: {
    scopeData: {},
    nodes: [
      {
        "id": "0",
        "type": "y-main"
      },
      {
        "id": "0-0",
        "type": "y-html",
        "tag": "div",
        "class": "header-part page-header",
        "style": {"padding-left": "20px"}
      },
      {
        "id": "0-0-0",
        "type": "y-html",
        "tag": "h2",
        "text": "Employee Management"
      },
      {
        "id": "0-1",
        "type": "y-card",
        "style": {"margin": "20px"}
      },
      {
        "id": "0-1-0",
        "type": "y-container"
      },
      {
        "id": "0-1-0-0",
        "type": "y-org-chart",
        "style": {
          "width": "100%",
          "height": "400px"
        },
        "eval": {"orgChart": "orgChart"}
      }
    ],
    basePageNode: {}
  }
};
