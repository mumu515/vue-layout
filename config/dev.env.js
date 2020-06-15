"use strict";
const merge = require("webpack-merge");

module.exports = merge({}, {
	NODE_ENV: "'development'", // node 启动版本
	TAGNAME: "'dev'", // cookie 存取前缀
	COREHR_URL: "'https://dev-swagger.ecosaas.com/ecosaascorehr/api/ecosaas/corehr'",
	// tenantId: "''",
	// tenantId: "'a4f4b08a-23fb-4263-b4fa-6e5dd7e5b3a7'",//dev-康师傅
	tenantId: "'test'",
	tenantToken: "'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ7XCJlbWFpbFwiOlwiYWRtaW5AcXEuY29tXCIsXCJsb2NhbGVcIjpcInpoX0NOXCIsXCJvdUlkXCI6OTc1OTgsXCJwZXJzb25JZFwiOlwiNWQ4OWM4MGMxMjY5ZDI0MmE1MWFiZDQ2XCIsXCJ0ZW5hbnRDb2RlXCI6XCJVVUFfQURNSU5cIixcInRlbmFudElkXCI6XCJhZG1pblwiLFwidXNlcklkXCI6XCI1ZDg5YzgwYzEyNjlkMjQyYTUxYWJkNDZcIixcInVzZXJuYW1lXCI6XCJhZG1pblwifSIsImF1dGgiOiJST0xFX1VTRVIiLCJleHAiOjE1OTI5ODU4MDZ9.u6KKPFj8p3ROx0PEull6cDy4rVLgCwrc8uxS2S_yCGHe9X8AzqdAKZZGeh5xSYIjbNjpK1GinXHg33Iaea_0zg'"
});
