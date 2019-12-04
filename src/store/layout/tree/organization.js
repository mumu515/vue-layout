export default () => ({
  path: "/corehr/ORGANIZATION/index/tree",
  scopes: [
    {
      scopeId: 1,
      data: {
        orgChart: {
          template: "ula",
          enableSearch: false,
          // mouseScrool: Vue._OrgChart.action.yScroll,
          // showYScroll: Vue._OrgChart.scroll.visible,
          nodeBinding: {
            field_0: "name",
            field_1: "title",
            img_0: "img"
          },
          nodes: [
            {
              id: "1",
              name: "Denny Curtis",
              title: "CEO"
            },
            {
              id: "1-1",
              pid: "1",
              name: "Ashley Barnett",
              title: "Sales Manager"
            },
            {
              id: "1-2",
              pid: "1",
              name: "Caden Ellison",
              title: "Dev Manager"
            }
            // {
            //   id: 4,
            //   pid: 2,
            //   name: "Caden Ellison",
            //   title: "Dev Manager",
            //   img: "https://balkangraph.com/js/img/5.jpg"
            // }
          ]
        }
      },
      action: {}
    }
  ],
  layout: {
    nodeType: "el-container",
    class: "main-container",
    props: {direction: "vertical"},
    scopeId: 1,
    children: [
      {
        nodeType: "y-org-chart",
        props: {config: "{orgChart}"}
      }]
  }
});
