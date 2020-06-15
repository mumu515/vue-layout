<template>
	<el-container direction="vertical">
		<el-container>
			<div class="container-left">
				<el-card>
					<el-form
							label-position="top"
							size="mini">
						<el-form-item label="组件">
							<y-component-list
									:list="componentList"
									groupName="main"></y-component-list>
						</el-form-item>
					</el-form>
				</el-card>
			</div>
			<div class="container-middle">
				<el-card>
					<y-layout-item
							:nodes="layoutResult"
							@itemClick="itemClick"></y-layout-item>
				</el-card>
			</div>
			<div class="container-right">
				<el-card>
					<div>{{currentSelect.label}}</div>
					<el-form
							label-position="top"
							size="mini">
						<el-form-item
								v-for="(value,key) in currentSelect.props"
								:key="key"
								:label="value.label">
							<el-select
									v-if="value.type==='select'"
									v-model="value.value">
								<el-option
										v-for="(item,index) in value.options"
										:key="index"
										:label="item.label"
										:value="item.value"></el-option>
							</el-select>
							<el-input
									v-else-if="value.type==='text'"
									v-model="value.value"></el-input>
							<el-input-number
									v-else-if="value.type==='number'"
									v-model="value.value"></el-input-number>
							<el-switch
									v-else-if="value.type==='switch'"
									v-model="value.value">
							</el-switch>
							<el-radio-group
									v-else-if="value.type==='radio'"
									v-model="value.value">
								<el-radio
										v-for="(item,index) in value.options"
										:key="index"
										:label="item.value">{{item.label}}
								</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-form>
				</el-card>
			</div>
		</el-container>
		<el-row>
			<el-card>
				<el-button @click="submitResult">提交</el-button>
			</el-card>
		</el-row>
	</el-container>
</template>
<script>
	import YLayoutItem from "./layout-item";
	import YComponentList from "./component-list";

	export default {
		name: "YPageConfig",
		inheritAttrs: false,
		components: {
			YLayoutItem,
			YComponentList
		},
		props: [],
		data() {
			return {
				currentSelect: {},
				componentList: [
					{
						label: "容器",
						nodeType: "el-container",
						groupName: "container",
						childGroupNames: ["row", "form"],
						props: {
							direction: {
								label: "排列方向",
								type: "radio",
								options: [
									{
										label: "横向",
										value: "horizontal"
									},
									{
										label: "纵向",
										value: "vertical"
									}]
							}
						}
					},
					{
						label: "行",
						nodeType: "el-row",
						groupName: "row"
					},
					{
						label: "列",
						nodeType: "el-col",
						props: {
							span: {
								label: "列宽(0-24)",
								type: "number"
							}
						},
						groupName: "main"
					},
					{
						label: "表单",
						nodeType: "el-form",
						groupName: "form",
						props: {
							labelPosition: {
								label: "label位置",
								type: "radio",
								options: [
									{
										label: "上",
										value: "top"
									},
									{
										label: "左",
										value: "left"
									},
									{
										label: "右",
										value: "right"
									}]
							},
							model: {
								label: "绑定数据key",
								type: "text",
								isEval: true
							}
						}
					},
					{
						label: "输入框",
						props: {
							label: {
								label: "label",
								type: "text"
							},
							prop: {
								label: "关联属性key",
								type: "text"
							},
							displayOnly: {
								label: "只读",
								type: "switch"
							}
						},
						nodeType: "y-input"
					},
					{
						label: "下拉框",
						props: {
							label: {
								label: "label",
								type: "text"
							},
							prop: {
								label: "关联属性key",
								type: "text"
							},
							displayOnly: {
								label: "只读",
								type: "switch"
							}
						},
						nodeType: "y-select"

					},
					{
						label: "时间选择框",
						props: {
							label: {
								label: "label",
								type: "text"
							},
							prop: {
								label: "关联属性key",
								type: "text"
							},
							displayOnly: {
								label: "只读",
								type: "switch"
							}
						},
						nodeType: "y-date-picker"

					}
				],
				defaultTreeProps: {
					children: "children",
					label: "label"
				},
				layoutResult: []
			};
		},
		methods: {
			submitResult() {
				console.log(this.layoutResult);
				let result = {};
				if (this.layoutResult.length === 1) {
					result = JSON.parse(JSON.stringify(this.layoutResult[0]));
				} else {
					result = {
						nodeType: "el-container",
						props: {direction: {value: "vertical"}},
						children: this.layoutResult.map(i => JSON.parse(JSON.stringify(i)))
					};
				}

				result = this.nodeToLayout(result);
				console.log(result);
			},
			itemClick(data) {
				console.log(data);
				this.currentSelect = data;
			},
			nodeToLayout(node) {
				let layout = {
					nodeType: node.nodeType,
					props: {
						...Object.keys(node.props || {}).reduce((r, c, i) => {
							if (node.props[c].isEval && !typeJudge.isUndefined(node.props[c].value)) {
								r[c] = `{${node.props[c].value}}`;
								return r;
							}
							r[c] = node.props[c].value;
							return r;
						}, {})
					},
					children: node.children ? node.children.map(i => this.nodeToLayout(i)) : undefined
				};
				return layout;
			},
			layoutToNode(layout) {
				let node = {
					nodeType: layout.nodeType

				};
				return node;
			}
		}

	};
</script>
<style
		lang="scss"
		type="text/scss"
		scoped>
	.container-left, .container-right {
		flex: none;
		width: 200px;

		.el-card {
			height: 100%;
		}

	}

	.container-middle {
		flex: auto;

		.el-card {
			margin: 0 5px;
			display: flex;
			flex-flow: column nowrap;
			align-items: stretch;
			min-height: 400px;
		}
	}
</style>
