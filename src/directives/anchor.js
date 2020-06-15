export default {
	name: "anchor",
	fun: {
		inserted: function(el, binding) {
			el.onclick = function() {
				console.log(el);
				console.log(binding);
				let total = 0;
				if (binding.value) {
					total = document.getElementById(`anchor-${binding.value}`).offsetTop;
				}
				let distance = 0;
				let scrollbar = document.getElementById("scrollbar");
				if (scrollbar) {
					let scrollbarWrap = scrollbar.children[0];
					distance = scrollbarWrap.scrollTop;
					let step = total / 50;
					if (total > distance) {
						(function smoothDown() {
							if (distance < total) {
								distance += step;
								scrollbarWrap.scrollTop = distance;
								setTimeout(smoothDown, 5);
							} else {
								scrollbarWrap.scrollTop = total;
							}
						})();
					} else {
						let newTotal = distance - total;
						step = newTotal / 50;
						(function smoothUp() {
							if (distance > total) {
								distance -= step;
								scrollbarWrap.scrollTop = distance;
								setTimeout(smoothUp, 5);
							} else {
								scrollbarWrap.scrollTop = total;
							}
						})();
					}
				} else {
					distance = document.documentElement.scrollTop || document.body.scrollTop;
					let step = total / 50;
					if (total > distance) {
						(function smoothDown() {
							if (distance < total) {
								distance += step;
								document.documentElement.scrollTop = distance;
								setTimeout(smoothDown, 5);
							} else {
								document.documentElement.scrollTop = total;
							}
						})();
					} else {
						let newTotal = distance - total;
						step = newTotal / 50;
						(function smoothUp() {
							if (distance > total) {
								distance -= step;
								document.documentElement.scrollTop = distance;
								setTimeout(smoothUp, 5);
							} else {
								document.documentElement.scrollTop = total;
							}
						})();
					}
				}
				
			};
		}
	}
};
