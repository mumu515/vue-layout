<script type="text/babel">
	export default {
		name: "YPreTable",
		inheritAttrs: false,
		props: {
			columns: {
				type: Array,
				default: () => []
			}, // {label,prop,displayType,displayOnly}
			data: {
				type: Array,
				default: () => []
			},
			rowActions: {type: Array},
			pagination: {type: Object}//todo
		},
		inject: {
			scope: {
				from: "scope",
				default: () => ({})
			},
			handleAction: {default: () => (() => {})}
		},
		render(h) {

			const createNode = () => {
				return <el-table
						style="width:auto"
						data={this.data}
						size="mini">
					{
						this.columns.map((item) => {
							if (item.displayType) {
								return h("el-table-column", {
									props: {label: item.label},
									scopedSlots: {
										default: (s) => {
											return h("y-pre-form", {
												props: {
													model: s.row,
													hideLabel: true,
													items: [
														{
															...item,
															label: undefined
														}]
												}
											});
										}
									}
								});
							} else {
								return <el-table-column
										label={item.label}
										prop={item.prop}></el-table-column>;
							}
						})
					}
					{
						this.rowActions ?
								h("el-table-column", {
									props: {label: "Action"},
									scopedSlots: {
										default: (s) => {
											return (this.rowActions || []).filter((child) => child !== undefined).map((child) => {
												if (child.displayType === "button") {
													return h("el-button", {
														props: {
															type: "text",
															size: "mini"
														},
														on: {
															click: () => {
																let v = child.on.click;
																if (typeJudge.isString(v)) {
																	let {data, api, action, parent} = this.scope;
																	eval(v);
																} else {
																	let params = {
																		append: s,
																		arguments: arguments
																	};
																	this.handleAction(v.actionName, v.$params, params);
																}
															}
														}
													}, child.label);
												}
											});

										}
									}
								})
								: undefined
					}
				</el-table>;
			};
			return createNode();

		}
	};
</script>
<style
  lang="scss"
  scoped>
</style>

