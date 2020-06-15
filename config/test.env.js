"use strict";
const merge = require("webpack-merge");

module.exports = merge({}, {
	NODE_ENV: "'development'", // node 启动版本
	TAGNAME: "'test'", // cookie 存取前缀
	COREHR_URL: "'https://api-test.ecosaas.com/api/ecosaas/corehr'",
	tenantId: "'61b5185a-27b1-44d1-89a3-aa83cd0f4a7e'",//empss
	tenantToken: "'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ7XCJpZE51bWJlclwiOlwiMjAxOTIzMjEyM1hYMDIzOTBcIixcImxvY2FsZVwiOlwiemhfQ05cIixcIm91SWRcIjoxNjgxMTEsXCJwZXJzb25JZFwiOlwiNWRlZjMzMDExMjY5ZDI4NWNmMTZkMGE4XCIsXCJwaG9uZVwiOlwiMTM5MDI3MzgzNjg4XCIsXCJ0ZW5hbnRDb2RlXCI6XCJlbXBTU1wiLFwidGVuYW50SWRcIjpcIjYxYjUxODVhLTI3YjEtNDRkMS04OWEzLWFhODNjZDBmNGE3ZVwiLFwidXNlcklkXCI6XCI1ZGVmMzMwMTEyNjlkMjg1Y2YxNmQwYThcIixcInVzZXJuYW1lXCI6XCJFTVAtU1MtMDAzLUhSXCJ9IiwiYXV0aCI6IlJPTEVfRU1QLFJPTEVfSFIiLCJleHAiOjE1OTI5NjE2MDB9.CzJVDNaNH96jfVJkbqfOvmGlrHX__X4X02dId3exfZVdr9EMMCnULqWsgRF1X6c1C0uAGX08WpOQSx12AhLhsw'"
});
