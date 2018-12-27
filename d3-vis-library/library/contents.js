var charts = [
	{
		name:"Aster Plot D3",
		id:1,
		src:"aster_plot_alcs.js",
		min_dims:1,
		max_dims:1,
		measures:1
	}	
];


var content_options = charts.map(function(d) {
	return {
		value: d.id,
		label: d.name
	}
});

var responsive_options = [
	{
		value: false,
		label: "No"
	}, {
		value: true,
		label: "Yes"
	}];
	
