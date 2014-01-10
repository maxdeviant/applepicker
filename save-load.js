function save() {
	data = {
		apples: apples,
		upgrade_list: { }
	}

	for (upgrade in upgrade_list) {
		data.upgrade_list[upgrade] = upgrade_list[upgrade].count;
	}

	//console.log(JSON.stringify(data));
	localStorage["Apple Picker"] = JSON.stringify(data);
}

function load() {
	if (localStorage["Apple Picker"]) {
		//console.log(JSON.parse(localStorage["Apple Picker"]));
		data = JSON.parse(localStorage["Apple Picker"]);

		apples = data.apples;
		for (upgrade in data.upgrade_list) {
			upgrade_list[upgrade].count = data.upgrade_list[upgrade];

			if (upgrade_list[upgrade].count > 0) {
				upgrade_cost(upgrade);
			}
		}

		calc_aps();
	}
}