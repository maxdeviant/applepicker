var version = "v0.5";

var clicks = 0;

var apples = 0;
var total_apples = 0;
var aps = 0;

var multiplier = 1;

var anim_length = 1000;
var tokens = [];

var lastUpdate = new Date();

function init() {
	$('#version').html(version);

	$('#tree').click(function(e) {
		click();
	});

	// $('.right-pane').children().css('display', 'none');
	// $('.right-pane > :first-child').css('display', 'block');
	// $('#upgrades').css('display', 'block');

	$('a').click(function() {
		$('a').css('text-decoration', 'none');
		$(this).css('text-decoration', 'underline');
	});

	// $('.tabs').click(function(e) {
	// 	$('.tab').removeAttr("id");
	// 	console.log(e);
	// })

	for (upgrade in upgrade_list) {
		upgrade_list[upgrade].cost = upgrade_list[upgrade].base_cost;

		$('#upgrades').append(sprintf('<div id="%s" class="element"></div>', upgrade));

		$(sprintf("#%s", upgrade)).append("<table></table>");
		$(sprintf("#%s table", upgrade)).append(sprintf('<tr><td>%s</td></tr><tr><td class="cost">%d Apples</td><td class="count">%d Owned</td></tr>', upgrade_list[upgrade].name, upgrade_list[upgrade].cost, upgrade_list[upgrade].count));
		
		function buy(upgrade) {
			return function() {
				buy_upgrade(upgrade);
			}
		}

		$(sprintf("#%s", upgrade)).click(buy(upgrade));
	}

	for (research in research_list) {
		research_list[research].cost = research_list[research].base_cost;

		$('#research').append(sprintf('<div id="%s" class="element"></div>', research));

		$(sprintf("#%s", research)).append("<table></table>");
		// $(sprintf("#%s table", research)).append(sprintf('<tr><td>%s</td></tr><tr><td class="cost">%d Apples</td><td class="count">%d Owned</td></tr>', research_list[research].name, research_list[research].cost, research_list[research].count));

		$(sprintf("#%s table", research)).append(sprintf('<tr><td>%s</td></tr><tr><td class="cost">%d Apples</td></tr>', research_list[research].name, research_list[research].cost));
		
		// function buy(research) {
		// 	return function() {
		// 		buy_research(research);
		// 	}
		// }

		$(sprintf("#%s", research)).click(buy(research));
	}

	load();
	$('#save').click(save);

	setInterval(update, 20);
	setInterval(save, 60000);
}

function click() {
	clicks += 1;
	var add = 1 + aps * multiplier;

	apples += add;

	new token(guid()).draw();
	// tokens.push(new token(guid()));

	// tokens.pop().draw();

	//console.log(clicks, apples);
}

function token(id) {
	this.id = id;
	this.anim_length = anim_length;

	this.draw = function() {
		$('.tree').append('<img class="token" id="' + this.id + '" src="res/apple.png" width="32px" height="32px"></img>');
		$('#' + this.id)
		.css('top', $('.tree').offset().top + Math.floor(Math.random() * $('.tree').height() - 50 + 1))
		.css('left', $('.tree').offset().left + Math.floor(Math.random() * $('.tree').width() + 1))
		.animate({
			top: "+=100",
			opacity: 0
		}, anim_length, function() {
			$('#' + this.id).remove();
		});
	}

	return this;
}

function buy_upgrade(upgrade) {
	if (apples < upgrade_list[upgrade].cost) {
		return;
	}

	apples -= upgrade_list[upgrade].cost;
	upgrade_list[upgrade].count += 1;

	upgrade_cost(upgrade);
	
	//upgrade_list[upgrade].cost = upgrade_list[upgrade].base_cost + Math.ceil(upgrade_list[upgrade].base_cost * Math.log(upgrade_list[upgrade].count + 1));

	calc_aps();
}

function upgrade_cost(upgrade) {
	upgrade_list[upgrade].cost = Math.floor(upgrade_list[upgrade].base_cost * Math.pow(upgrade_list[upgrade].count, 1.2));

	$("#" + upgrade).find(".cost").html(sprintf("%d Apples", upgrade_list[upgrade].cost));
	$("#" + upgrade).find(".count").html(sprintf("%d Owned", upgrade_list[upgrade].count));
}

function calc_aps() {
	aps = 0;
	for (upgrade in upgrade_list) {
		aps += upgrade_list[upgrade].aps * upgrade_list[upgrade].count;
	}

	$("#aps").html(sprintf("%.1f Apples per second", aps));
}

function update() {
	var currTime = new Date();

	var ms = currTime.getTime() - lastUpdate.getTime();
	lastUpdate.setTime(currTime.getTime());

	apples += aps * (ms / 1000);

	$('#apples').html(sprintf("%d Apples", apples));
	$('#aps').html(sprintf("%.1f Apples per second", aps));

	$('title').html(sprintf("%d Apples | Apple Picker %s", apples, version));
}

function guid() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	    return v.toString(16);
	});
}