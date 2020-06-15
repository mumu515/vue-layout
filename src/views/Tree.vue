<template>
  <y-page
    :node="basePageNode"
    :scopeData="scopeData"
    v-if="isReload">
  </y-page>
</template>
<script>
	// import {ApiOptions} from "@/corehr/service/apiOptions";
	// import {getBasePageNode} from "@/corehr/components/utils/componentsHelper";
	import {mapState} from "vuex";

	export default {
		name: "CorehrTree",
		props: {
			pageType: String
		},
		data() {
			return {
				isReload: false,
				loading: {},
				nodes: [],
				basePageNode: {},
				scopeData: {
					orgChart: {
						enableSearch: false,
						scaleMin: 0.5,
						scaleMax: 2.5,
						nodeMenu: {
							details: {
								icon: "",
								text: "Detail"
							},
							add: {text: "Add New"},
							edit: {text: "Edit"},
							remove: {text: "Remove"}
							// custom: {icon: "", text: "Custom", onClick: (nodeId) => {}}
						},
						nodeBinding: {
							field_0: "type",
							field_1: "id",
							field_2: "tag"
						},
						nodes: [],
						// tags: {"m": {template: "rony"}},
						// template: "rony",
						template: "yTemplate",
						templates: {
							yTemplate: {
								node: {height: 100},
								field_0: {top: 20},
								field_1: {top: 40},
								field_2: {top: 60}
							}
						},
						collapse: {
							level: 2,
							allChildren: true
						}
					},
					eventHandle: this.eventHandle()
				}
			};
		},
		mounted() {
			this.initData();
		},
		computed: {
			...mapState("corehr", {refs: (state) => state.base.refs})
		},
		methods: {
			updateBasePageNode() {
				// this.basePageNode = getBasePageNode(this.nodes);
				this.reload();
			},
			reload() {
				this.isReload = false;
				this.$nextTick(() => { this.isReload = true; });
			},
			async initData() {
			},
			back() {
				this.$router.back();
			},
			eventHandle() {
				const _self = this;
				return {
					back() {
						_self.back();
					}
				};
			}
		}
	};
</script>
<style scoped>
</style>
