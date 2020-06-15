import "./utils/globalComponents";

import CorehrBase from "@/views/CorehrBase";
import CorehrRoot from "@/views/CorehrRoot";
import ConfigLayout from "@/views/ConfigLayout";
import ObjectLayout from "@/views/ObjectLayout";
import KeepAliveObjectLayout from "@/views/KeepAliveObjectLayout";

let components = {};

const requireComponent = require.context("../components", true, /.*(\/).+(\/index\.js)$/);

// 本层目录的组件自动注册
requireComponent.keys().forEach((fileName) => {
	const componentConfig = requireComponent(fileName);	// 获取组件配置
	components[componentConfig.default.name] = componentConfig.default;
});
// src/views下组件手动注册
components["CorehrBase"] = CorehrBase;
components["CorehrRoot"] = CorehrRoot;
components["ConfigLayout"] = ConfigLayout;
components["ObjectLayout"] = ObjectLayout;
components["KeepAliveObjectLayout"] = KeepAliveObjectLayout;
export default components;
