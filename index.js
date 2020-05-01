document.getElementById('top').addEventListener('click', function (){ showup_chr('top');s }); 
document.getElementById('mid').addEventListener('click', function (){ showup_chr('mid'); }); 
document.getElementById('adc').addEventListener('click', function (){ showup_chr('adc'); }); 
document.getElementById('support').addEventListener('click', function (){ showup_chr('support'); }); 
document.getElementById('jungle').addEventListener('click', function (){ showup_chr('jungle'); }); 
var svg = d3.select('.demo').append('svg').attr({'width': 1500,'height': 250});

function showup_chr(category){
	var file = category + '.csv';
	console.log(file);
	d3.csv(file,function(data){
		console.log(data);
		var w = 1500,h = 250,padding = 40, barMargin = 2;
		//定義寬高,padding等等值
		dataset=data;
		dataset.forEach(function(d){ d.勝率 = parseFloat(d.勝率)});
		var Ymax = d3.max(dataset, function(d){return d.勝率})+1;
		var	Ymin = d3.min(dataset, function(d){return d.勝率});
			//取得Y軸的最大值
		console.log(Ymax);
		var xScale = d3.scaleLinear() //產生一個屬於X軸的線性尺度
			.domain([0, dataset.length]) //傳入的值是原始資料的最小及最大值
			.range([0 , w ]) 
			//輸出的範圍是左邊的padd距離，到右邊的padding

		var yScale = d3.scaleLinear()
			.domain([Ymin, Ymax])
			.range([padding, h - padding])
			//類似X軸的尺度

		var colorScale = d3.scaleLinear()
			.domain([Ymin, Ymax])
			.range([0, 700])
			//這次顏色都要用尺度來算

		var barWidth = (w*0.8 - padding*2) / dataset.length - barMargin;
		// var svg = d3.select('.demo').append('svg').attr({'width': w,'height': h})
			//接下來開始產生SVG
		if (svg != null){
			d3.selectAll('rect').remove()
			d3.selectAll('text').remove()
			d3.selectAll('g').remove()
		};
		svg.selectAll('rect').data(dataset).enter() //和先前一樣，選取'circle'並把資料加入
		.append('rect') // 增加圓到SVG內
		.attr({	//加入屬性到圓
			'x': function(d, i){return xScale(i)}, //利用尺度算出X的位置
			'y': function(d){return h - yScale(d.勝率)}, //同理算出Y
			'width': barWidth,
			'height':function(d){return yScale(d.勝率)}, //同理算出Y
			// 'r': function(d){return Math.sqrt(h - d[1])}, //圓的大小是高 - Y值的平方
			'fill': function(d,i){
				var color = 0.2 + colorScale(d.勝率) * 0.001;
				return  d3.hsl(200 ,color, color); //利用尺度來算出顏色
			},
			'title': function(d,index){
				return "Name : " + d.英雄名;
			}
			//介紹一個顏色的function hsl，可以將顏色算出後轉成色碼
			//格式 (360色相, 1彩度, 1明度)
		});
		svg.selectAll('text').data(dataset).enter() //補上資料數值
		.append('text') 
		.text(function(d){ return d.勝率}) //將值寫到SVG上
		.attr({
			'x': function(d, i){return xScale(i) + barWidth/2}, //和上面相同，算出X、Y的位置
			'y': function(d){return h - yScale(d.勝率) + 11},
			'fill': 'white', //文字填滿為紅色
			'text-anchor': 'middle',
			'font-size': '10px' //Fill、font-size也可以用CSS寫喔～
		});

		svg.append('g').selectAll('text').data(dataset).enter() //這邊再多做一個人名顯示的區域
		.append('text') 
		.text(function(d){ return d.英雄名}) //寫入人名
		.attr({
			'x': function(d, i){return xScale(i) + barWidth/2}, //和上面相同，算出X、Y的位置
			'y': function(d){return h - yScale(d.勝率) -3},
			'fill': 'SlateGray', //文字填滿為超漂亮灰色
			'text-anchor': 'middle',
			'font-size': '10px' //Fill、font-size也可以用CSS寫喔～
		});
	});

}
