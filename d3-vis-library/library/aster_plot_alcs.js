/**
 *	aspter_plot_alcs.js
 *	https://github.com/dersonluis/AsterPlotD3Alcs
 *	
 *	O gráfico de Aster é do tipo fatias de pizza
 *	com comprimentos relativos aos pesos de cada uma de suas fatias
 *	que se estendem até às bordas da circunferência do gráfico.
 *	
 *	@version 1.0.1
 *  @date    2018-12-26
 *	
 *	Configurações básicas de Dimensões e medidas:
 *	LABEL = DIMENSÃO_1
 *	ID = MEDIDA_1
 *	
 */

function defineColor(cor){
	console.log('aqui');
	var search = ",";
	var colorAux = [];
	var antPos = -1;
	var pos = cor.indexOf(search);
	while (pos > -1){
		colorAux.push(cor.substring(antPos + 1, pos));
		antPos = pos;
		pos = cor.indexOf(search, antPos + 1);
	}
	return colorAux;	
}



var viz = function($element,layout,_this) {
	var id = senseUtils.setupContainer($element,layout,"d3vl_aster"),
		ext_width = $element.width(),
		ext_height = $element.height(),
		classDim = layout.qHyperCube.qDimensionInfo[0].qFallbackTitle.replace(/\s+/g, '-');

	var data = layout.qHyperCube.qDataPages[0].qMatrix;
	var dataAux = layout.qHyperCube.qDataPages[0].qMatrix;
	
	//truncar dados
	if(layout.maxItems != 0){	
		if(data.length - 1 > layout.maxItems){
			var aux = 0;
			for (i = layout.maxItems - 1; i< data.length; i++){
				aux += data[i][1].qNum;
			}
			data[layout.maxItems - 1][0].qText = "Others";
			data[layout.maxItems - 1][1].qNum = aux;
						
			data = data.slice(0, layout.maxItems);
		}
	}

	var url = document.location.origin + "/extensions/d3-vis-library/js/d3.tip.v0.6.3.js";
	
	var leg = layout.legend;
	var maxItens = layout.maxItems;
	var self = _this;
	
	var cor = defineColor(layout.rangeColors);
		
	// Load in the appropriate script and viz
	jQuery.getScript(url,function() {
		console.log('anderson');
		var margin = {top: 10, right: -30, bottom: 10, left: 10},
			width = ext_width - margin.left - margin.right,
			height = ext_height - margin.top - margin.bottom			
		    radius = Math.min(width, height) / 2,
		    innerRadius = 0.3 * radius;
		
		var pie = d3.layout.pie()
		    .sort(null)
		    .value(function(d) { 
				return d.measure(1).qNum; 
			});
			
		
		// calculate the MED1
		var score =
			data.reduce(function(a, b) {
				//console.log('a:' + a + ', b.score: ' + b[2].qNum + ', b.weight: ' + b[3].qNum);
				return a + b[1].qNum;
			}, 0);
			
		 var tip = d3.tip()
			.attr('class', 'd3-tip')
			.offset([0, 0])
			.html(function(d) {
				return d.data[0].qText + ": <span style='color:orangered'>" + Math.round(d.data[1].qNum * 100 / score) + "%</span>";
			}); 
		
		var max_2 = d3.max(data,function(d) {
			return d[1].qNum
		});
		
		var arc = d3.svg.arc()
		  .innerRadius(innerRadius)
		  .outerRadius(function (d) {
			return (radius - innerRadius) * (d.data.measure(1).qNum / max_2) + innerRadius; 
		  });	
			
		var outlineArc = d3.svg.arc()
			.innerRadius(innerRadius)
			.outerRadius(radius);

		var svg = d3.select("#" + id).append("svg")
			.attr("width", width)
			.attr("height", height)
			.append("g")
			.attr("transform", "translate(" + 
				(leg ? (width/2 - (width * 12.5 / 100)) : width/2) + "," + height / 2 + ")");
			
		svg.call(tip);
		tip.hide;
		var color = d3.scale.ordinal()
			//.domain(data.map(function(d) {return d.dim(1).qText; }))
			//.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
			//var color =  d3.scale.category20();
			.range(cor);
		
		var path = svg.selectAll(".solidArc")
			.data(pie(data))
			.enter().append("path")
			.attr("fill", function(d) { return color(d.data[0].qText); })
			.attr("class", "solidArc "+ classDim)
			.attr("id", function(d) { return d.data[0].qText; })
			.attr("stroke", "gray")
			.attr("d", arc)
			.on("mouseover", tip.show) // these tips don't seem to work
			.on("mouseout", tip.hide) // these tips don't seem to work
			.on("click", function(d, i) {	
				//hide popup	
				var pop = document.getElementsByClassName("d3-tip n");
				for(var j = 0; j < pop.length; j++)
					pop[0].parentNode.removeChild(pop[j]);
				pop = document.getElementsByClassName("d3-tip");
				for(var j = 0; j < pop.length; j++)
					pop[0].parentNode.removeChild(pop[j]);
				
				//selection
				var value = parseInt(d.data.dim(1).qElemNumber,10), dim = 0;
				if(i == maxItens - 1){
					data = dataAux.slice(maxItens-1,dataAux.length-1);
					var value = [];
					for(var j = 0; j < data.length; j++)
						value.push(data[j][0].qElemNumber);
					self.selectValues(dim, value, true);
				}
				else{
					data = dataAux;
					//d.data.dim(1).qSelect();				
					self.selectValues(dim, [value], true);
				}
			});			
		
		var g = svg.selectAll(".arc")			
			.data(pie(data))
			.enter().append("g")			
			.attr("class", "arc");

		g.append("text")
			.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
			.attr("dy", ".35em")
			.style("text-anchor", "middle")
			.style("fill", "#ffffff")
			//.attr("font-size", "28")
			.text(function(d) {
				return '' + d.data.measure(1).qNum;
			});				

		var outerPath = svg.selectAll(".outlineArc")
			.data(pie(data))
			.enter().append("path")
			.attr("fill", "none")
			.attr("stroke", "gray")
			.attr("class", "outlineArc")
			.attr("d", outlineArc);		

		svg.append("svg:text")
		.attr("class", "aster-score")
		.attr("dy", ".35em")
		.style("text-anchor", "middle")
		.attr("font-size", function(d) {
			return Math.round(score).toString().length <= 4 ? "300%" : "100%"
		})
		.text(Math.round(score));
		
		//LEGENDA	
		if (leg){	
			var plot = svg.append("g")
				.append("g");
				
			var legend = plot.selectAll(".legend")
				.data(color.domain().slice())
				.enter().append("g")
				.attr("class", "legend")
				.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
				.on("click",function(d, i) {
					var value = parseInt(data[i][0].qElemNumber,10), dim = 0;
					if(i == maxItens - 1){
						data = dataAux.slice(maxItens-1,dataAux.length-1);
						var value = [];
						for(var j = 0; j < data.length; j++)
							value.push(data[j][0].qElemNumber);
						self.selectValues(dim, value, true);
					}
					else{
						data = dataAux;
						//d.data.dim(1).qSelect();				
						self.selectValues(dim, [value], true);
					}
				});

			
			legend.append("rect")
				.attr("x", (width/2) + 6)
				.attr("y", -(height/2))
				.attr("width", 18)
				.attr("height", 18)
				.style("fill", color);

			legend.append("text")
				.attr("x", width/2)
				.attr("y", -(height/2) + 9)
				.attr("dy", ".35em")
				.style("text-anchor", "end")
				.text(function(d) { return d; });			
		}
	});
}