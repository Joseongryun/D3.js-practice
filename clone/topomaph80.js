    function button1_click() {
    	alert("test");

    	var retVal = prompt("서브맵명을 입력하십시요 : ", "11");
    	alert("You have entered : " + retVal);
    }

    var param_group_cd = '1'; // 검색조건에 반드시 필요
    var param_menu_cd = '';
    //var submapid = 'G1_rootmap';
    var submapid = '';
    var userid = 'U000001';
    var mapmode_edit = false;

    if (submapid == null || submapid == '')
    	submapid = 'G1_rootmap';

    console.log("submapid=" + submapid);

    window.onload = function () {
    	console.log("window.onload");

    	startFaultmon();
    };

    $(document).ready(function () {

    	console.log("doucment.ready");

    	generateLoader('body', 'mainLoader');

    	console.log("param_group_cd=" + param_group_cd);
    	makeSubmapTree(submapid);

    	makeGroupTree();



    	$('#btn_line_add').on('click', function () {
    		//버튼을 눌렀을 때 모든 데이터 확인

    		if (lineappendmode == true) {
    			lineappendmode = false;

    			alert("선 그리기 모드 해제");
    		} else {
    			lineappendmode = true;
    			alert("선 그리기 모드");
    		}
    	});
    	$('#btn_map_save').on('click', function () {
    		if (!mapmode_edit)
    			return;

    		alert("저장중");
    		SaveTopologyMAP();
    	});
    	$('#btn_map_mode').on('click', function () {

    		$('#groupdevicetree').toggle();
    		mapmode_edit = !mapmode_edit;

    		alert("편집모드 : " + mapmode_edit);
    	});

    	$('#groupdevicetree').hide();
    });


    function startFaultmon() {
    	faultmon.initialize();

    	setInterval("faultmon.requestFaultData(submapid, userid)", 5000);
    }


    function stopFaultmon() {
    	faultmon.disconnect();
    }

    function makeSubmapTree(mapid) {
    	if (!$('#SubmapTree').exists()) {
    		$('#submaptree').html("<div id='SubmapTree' class='Page_Grid_Option'></div>"); //$('<div>',{id:'GroupTree'}).addClass('Page_Grid_Option'));
    	}

    	console.log("submapid=" + mapid);
    	var formData = {
    		m_id: mapid
    	};

    	$.ajax({
    		url: '/map/usersubmaplist.do',
    		type: "POST",
    		headers: {
    			Accept: 'application/json'
    		},
    		data: formData,
    		cache: false,
    		async: false,
    		//data : JSON.stringify(formData),
    		success: function (data) {
    			var source = {
    				datatype: "json",
    				datafields: [{
    						name: 'm_id'
    					},
    					{
    						name: 'm_pid'
    					},
    					{
    						name: 'm_name'
    					},
    					{
    						name: 'mid_full'
    					},
    					{
    						name: 'icon_image'
    					}
    				],
    				id: 'm_id',
    				localdata: data
    			};

    			var dataAdapter = new $.jqx.dataAdapter(source);
    			dataAdapter.dataBind();

    			var records = dataAdapter.getRecordsHierarchy('m_id', 'm_pid', 'items', [{
    				name: 'm_name',
    				map: 'label'
    			}, {
    				name: 'm_id',
    				map: 'value'
    			}, {
    				name: 'icon_image',
    				map: 'icon'
    			}]);
    			$('#SubmapTree').jqxTree({
    				allowDrag: false,
    				allowDrop: false,
    				source: records,
    				height: '100%',
    				width: '100%',
    				theme: theme
    			});
    			$('#SubmapTree').on('select', function (event) {

    				var args = event.args;
    				var item = $('#SubmapTree').jqxTree('getItem', args.element);

    				console.log("clicked submap node [item.value]=" + item.value);
    				var mid_full = item.map_fullid;
    				/*
    				var $element = $(event.args.element);
    				element_item = $element; 
    				*/
    				//updateRegDataSource();
    				//updateDataSource();
    				console.log("clicked id=" + args.id);
    				console.log("clicked group node [label]=" + item.label + ",[id]=" + item.id + ", [item]=" + item);
    				//makeDeviceTree(item.id);

    				submapid = item.value;
    				console.log("clicked submapid=" + submapid);

    				/*
					event.preventDefault();
	                var form = $(this);
	                var post_url = '/map/topomaph80.do';
	                var post_data = form.serialize();
	                $.ajax({
	                    type: 'POST',
	                    url: post_url, 
	                    data: post_data,
	                    success: function(msg) {
	                        //$(form).fadeOut(800, function(){
	                        //    form.html(msg).fadeIn().delay(2000);

	                        //});
	                    }
	                });
	                */

    				getSubmapInfo(submapid);
    			});

    			$('#SubmapTree').jqxTree('expandAll');
    		}
    	});
    }

    function makeGroupTree() {
    	if (!$('#GroupTree').exists()) {
    		$('#grouptree').html("<div id='GroupTree' class='Page_Grid_Option'></div>"); //$('<div>',{id:'GroupTree'}).addClass('Page_Grid_Option'));
    	}

    	$.ajax({
    		url: '/map/usergrouplist.do',
    		type: "POST",
    		headers: {
    			Accept: 'application/json'
    		},
    		success: function (data) {
    			var source = {
    				datatype: "json",
    				datafields: [{
    						name: 'id'
    					},
    					{
    						name: 'parentid'
    					},
    					{
    						name: 'text'
    					},
    					{
    						name: 'value'
    					},
    					{
    						name: 'icon_image'
    					}
    				],
    				id: 'id',
    				localdata: data
    			};

    			var dataAdapter = new $.jqx.dataAdapter(source);
    			dataAdapter.dataBind();

    			var records = dataAdapter.getRecordsHierarchy('id', 'parentid', 'items', [{
    				name: 'text',
    				map: 'label'
    			}, {
    				name: 'icon_image',
    				map: 'icon'
    			}]);
    			$('#GroupTree').jqxTree({
    				allowDrag: false,
    				allowDrop: false,
    				source: records,
    				height: '100%',
    				width: '100%',
    				theme: theme
    			});

    			$('#GroupTree').on('select', function (event) {

    				var args = event.args;
    				var item = $('#GroupTree').jqxTree('getItem', args.element);
    				var label = item.label;
    				/*
    				var $element = $(event.args.element);
    				element_item = $element; 
    				*/
    				//updateRegDataSource();
    				//updateDataSource();
    				console.log("clicked group node [label]=" + item.label + ",[id]=" + item.id + ", [item]=" + item);
    				makeDeviceTree(item.id);
    			});

    			$('#GroupTree').jqxTree('expandAll');
    		}
    	});
    }

    function makeDeviceTree(grpid) {
    	if (!$('#DeviceTree').exists()) {
    		$('#devicetree').html("<div id='DeviceTree' class='Page_Grid_Option'></div>"); //$('<div>',{id:'GroupTree'}).addClass('Page_Grid_Option'));
    	}
    	console.log("grpip=" + grpid);
    	var formData = {
    		group_cd: grpid
    	};
    	//formData.push({group_cd: grpid});

    	$.ajax({
    		url: '/map/devicelist.do',
    		type: "POST",
    		headers: {
    			Accept: 'application/json'
    		},
    		data: formData,
    		cache: false,
    		async: false,
    		success: function (data) {
    			var source = {
    				datatype: "json",
    				datafields: [{
    						name: 'host_name'
    					},
    					{
    						name: 'host_name'
    					},
    					{
    						name: 'sys_name'
    					},
    					{
    						name: 'host_alias'
    					},
    					{
    						name: 'h_imagefilename'
    					}
    				],
    				id: 'host_name',
    				localdata: data
    			};

    			var dataAdapter = new $.jqx.dataAdapter(source);
    			dataAdapter.dataBind();

    			var records = dataAdapter.getRecordsHierarchy('host_name', null, 'items', [{
    				name: 'host_alias',
    				map: 'label'
    			}, {
    				name: 'host_name',
    				map: 'value'
    			}, {
    				name: 'h_imagefilename',
    				map: 'icon'
    			}]);
    			$('#DeviceTree').jqxTree({
    				allowDrag: true,
    				allowDrop: false,
    				source: records,
    				height: '100%',
    				width: '100%',
    				theme: theme
    				//dragEnd: function (item, dropItem, args, dropPosition, tree) {

    				//console.log("--- dropItem s");
    				//console.log("-" + dropItem.);
    				//console.log("-" + dropPosition);
    				//console.log("-" + args);
    				//console.log("--- dropItem.target.id=" + dropItem.target);
    				//if ( dropItem.target.id === 'DeviceTree' )
    				//{
    				//console.log('[1][... dragend] =' +item.label );
    				//return false;
    				//}
    				//}  
    			});

    			$('#DeviceTree').on('select', function (event) {});
    			$('#DeviceTree').jqxTree('expandAll');
    		}
    	});
    }



    function setFaultInfo(host_name, faultlevel, iconfile) {
    	var node = findNode(host_name);

    	console.log("fault host_name = " + host_name);
    	if (node) {
    		node.icon = iconfile;
    		console.log("findnode = id=" + node.id);
    	}

    	//redraw();
    }

    function setFaultNormal() {
    	console.log("setFaultNormal node count = " + nodes.length);

    	for (var i = 0; i < nodes.length; i++) {

    		//console.log("node id = " + nodes[i].id);
    		//console.log("node host_name = " + nodes[i].host_name);
    		//console.log("node icon = " + nodes[i].icon);
    		//console.log("node icon_normal = " + nodes[i].icon_normal);

    		if (nodes[i].icon != nodes[i].icon_normal)
    			nodes[i].icon = nodes[i].icon_normal;
    	};
    }

    var findNode = function (hostname) {
    	for (var i = 0; i < nodes.length; i++) {

    		//console.log("node id = " + nodes[i].id);
    		//console.log("node host_name = " + nodes[i].host_name);

    		if (nodes[i].host_name === hostname)
    			return nodes[i]
    	};
    }

    function refreshPage(pageURL, map_id) {
    	stopFaultmon();

    	location.reload();
    }

    var nodemenu = [{
    		title: 'Conctext Node',
    		action: function (elm, d, i) {
    			alert("Clicked  " + d.name);

    			var url = "http://192.168.105.235";
    			window.open(url);
    			//url += d.link_id;
    		}
    	},
    	{
    		title: '장비정보',
    		action: function (elm, d, i) {
    			alert("Clicked  " + d.name + ", hostname=" + d.host_name + ", id=" + d.id);
    		}
    	}
    ];

    var canvasmenu = [{
    		title: 'Edit MAP...',
    		action: function (elm, d, i) {
    			alert("Clicked  " + i);
    		}
    	},
    	{
    		title: '서브맵 등록',
    		action: function (elm, d, i) {
    			//alert("Clicked  " + d.name);

    			var retVal = prompt("서브맵명을 입력하십시요 : ", "11");
    			alert("You have entered : " + retVal);
    		}
    	}
    ];


    var i = 0;
    var margin = {
    		top: 20,
    		right: 120,
    		bottom: 20,
    		left: 20
    	},
    	width = 800 - margin.right - margin.left,
    	height = 700 - margin.top - margin.bottom;

    var nImageWidth = 30;
    var nImageHeight = 53;

    var nodes = [];
    var links = [];
    var color = d3.scale.category20();

    //mouse event vars
    var dragged = null,
    	selected_node = null,
    	selected_link = null,
    	mousedown_link = null,
    	mousedown_node = null,
    	mouseup_node = null,
    	lineappendmode = null;


    var force = d3.layout.force()
    	.nodes(nodes)
    	.links(links)
    	.size([width, height])
    	.linkDistance(150)
    	.charge(-500)
    	.on('tick', tick);

    var svg = d3.select("#graph").append("svg")
    	.attr("width", width + margin.right + margin.left)
    	.attr("height", height + margin.top + margin.bottom)
    	//.append("g")
    	//.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    	.on('contextmenu', d3.contextMenu(canvasmenu))
    	.on("mousemove", mousemove)
    	.on("mousedown", mousedown)
    	.on("mouseup", mouseup)
    	.on("dblclick", dblclick);

    /*화살표
    svg.append("defs").selectAll("marker")
    	.data(["Triangle", "licensing", "resolved"])
  		.enter().append("marker")
    	//.attr("id", function(d) { return d; })
    	.attr("id", "Triangle")
    	.attr("viewBox", "0 -5 10 10")
    	.attr("refX", 15)
    	.attr("refY", -1.5)
    	.attr("markerUnits", 'userSpaceOnUse')
    	.attr("markerWidth", 6)
    	.attr("markerHeight", 6)
    	.attr("orient", "auto")
  		.append("path")
    	.attr("d", "M0,-5L10,0L0,5");
      */
    var node_drag = d3.behavior.drag()
    	.on("dragstart", dragstart)
    	.on("drag", dragmove)
    	.on("dragend", dragend);


    var drag_line = svg.append("path")
    	.attr("class", "drag_line")
    //.attr("x1", 0)
    //.attr("y1", 0)
    //.attr("x2", 0)
    //.attr("y2", 0)
    //.attr("d", "M0,-5L10,0L0,5");
    ;

    var map_url = "/map/getTopologyMap.do?m_id=" + submapid;
    console.log("start----------map data url = " + map_url);
    d3.json(map_url, function (error, graph) {

    	if (error) {
    		console.log("error ---------");

    		stopFaultmon();
    		refreshPage('/index.do');
    		throw error;
    	}

    	/* link를 위해, d3는 link source, target이  node의 index이므로  재배열*/
    	var nodeMap = {};

    	graph.nodes.forEach(function (d) {
    		nodeMap[d.id] = d;
    	});
    	graph.links.forEach(function (l) {

    		if (typeof nodeMap[l.target] === 'undefined') {
    			//console.log("l.source undefined id=" + nodeMap[l.source]);
    			console.log("l.source undefined id=" + l.target);
    		} else {
    			l.target = nodeMap[l.target];
    		}
    		if (typeof nodeMap[l.source] === 'undefined') {
    			console.log("l.source undefined id=" + l.source);
    			//console.log("l.source undefined id=" + l.target);
    		} else {
    			l.source = nodeMap[l.source];
    		}
    	}); // end.  graph.links.forEach(function (l)


    	console.log("force start after");

    	var link = svg.selectAll(".link")
    		.data(graph.links)
    		.enter().append("path")
    		.attr("class", "link")
    		.attr("weight", 2)
    		//.attr("x1", function (d) { return d.source.x+nImageWidth/2; })
    		//.attr("y1", function (d) { return d.source.y+nImageHeight/2; })
    		//.attr("x2", function (d) { return d.target.x+nImageWidth/2; })
    		//.attr("y2", function (d) { return d.target.y+nImageHeight/2; })
    		//.attr("marker-end", function(d) { return "url(#" + d.type + ")"; })
    		//.attr("marker-end", "url(#Triangle)")
    		.style("stroke-width", function (d) {
    			return Math.sqrt(d.value);
    		});

    	var node = svg.selectAll(".node")
    		.data(graph.nodes)
    		//.enter().append("circle")
    		.enter().append("g")
    		//.on("click", function (d) { d.fixed = true })
    		.attr("class", "node")
    		.attr("id", function (d) {
    			return d.id;
    		})
    		//.call(force.drag)       //shryu-1
    		.call(node_drag)
    		.on("mousedown", function (d) {
    			mousedown_node = d;
    			selected_node = d;
    			selected_link = null;

    			console.log("[mouse] node mousedown =" + d.name);

    			redraw();
    		})
    		.on("mouseup", function (d) {
    			//selected_node = d;
    			mouseup_node = d;
    			console.log("[mouse] node mouseup =" + d.name);
    			redraw();
    		}); //end.  var node 

    	node.append("image")
    		.attr('x', function (d) {
    			return d.x;
    		})
    		.attr('y', function (d) {
    			return d.y;
    		})
    		.attr('width', nImageWidth)
    		.attr('height', nImageHeight)
    		.on('contextmenu', d3.contextMenu(nodemenu))
    		.attr("xlink:href", function (d) {
    			return d.icon
    		});
    	//.call(force.drag);           // 드래그시  Node fixed가 되지 않는다.


    	node.append("text")
    		//.attr('dx', function (d) { return d.x-nImageWidth/2; })
    		//.attr('dy', function (d) { return d.y+nImageHeight; })
    		.attr('dx', function (d) {
    			return d.x;
    		})
    		.attr('dy', function (d) {
    			return d.y;
    		})
    		.attr('text-anchor', "middle")
    		//.attr("dy", ".35em")
    		//.attr("dy", nImageHeight)
    		//.attr("y", 15)
    		//.text(function (d) { console.log("[" + i + "] ----" + d.name); return d.name })
    		.text(function (d) {
    			return d.name
    		});

    	i++;



    	nodes = graph.nodes;
    	links = graph.links;

    	console.log("[json]  graph.nodes size=" + graph.nodes.length);
    	console.log("[json]  graph.links size=" + graph.links.length);

    	redraw();
    }); // end d3.json(map_url, function (error, graph) 


    //get layout properties
    var nodes = force.nodes(),
    	links = force.links(),
    	node = svg.selectAll(".node"),
    	link = svg.selectAll(".link");
    console.log("[topomaph_man]  nodes.nodes size=" + nodes.length);
    console.log("[topomaph_man]  links.links size=" + links.length);


    // add keyboard callback
    d3.select(window)
    	.on("keydown", keydown);



    function dblclick() {
    	alert("dblclick");
    }


    function mousedown() {
    	console.log("mousedown");
    	if (!mousedown_node && !mousedown_link) {
    		selected_node = null;
    		selected_link = null;

    		console.log("[mousedown] mousedown_node=null, mousedown_link=null ");

    		redraw();
    		return;
    	}

    	if (mousedown_node) {
    		// reposition drag line
    		dragged = true;

    		drag_line
    			.attr("class", "link")
    			.attr("x1", mousedown_node.x)
    			.attr("y1", mousedown_node.y)
    			.attr("x2", mousedown_node.x)
    			.attr("y2", mousedown_node.y);

    		console.log("[mousedown] mousedown_node=not null ");

    	}
    	redraw();

    } //end.  function mousedown() {



    function mousemove() {
    	//console.log("mousemove");
    	if (!mousedown_node) {
    		//console.log("[mousemove] mousedown_node=null ");
    		return;
    	}

    	// update drag line
    	drag_line
    		//.attr("class", "link")
    		.attr("x1", mousedown_node.x)
    		.attr("y1", mousedown_node.y)
    		.attr("x2", d3.mouse(this)[0])
    		.attr("y2", d3.mouse(this)[1]);

    } // end.  function mousemove() 


    function mouseup() {
    	console.log("mouseup");
    	// hide drag line
    	drag_line.attr("class", "drag_line_hidden");

    	if (mouseup_node == mousedown_node) {

    		console.log("[mouseup] mouseup_node==mousedown_node ");

    		resetMouseVars();
    		return;
    	}

    	if (mouseup_node) {
    		// add link

    		console.log("[mouseup] from=" + mousedown_node.host_name + ", to=" + mouseup_node.host_name);
    		//var link = {source: mousedown_node, target: mouseup_node};
    		//links.push(link);

    		var objid = submapid + '_' + mousedown_node.host_name + '_' + mouseup_node.host_name + "_" + Math.floor((Math.random() * 1000000) + 1);
    		InsertLineInfo(objid, mousedown_node.host_name, mousedown_node.id, mouseup_node.host_name, mouseup_node.id);

    		createLink(mousedown_node.id, mouseup_node.id);

    		// select new link
    		selected_link = link;
    		selected_node = null;

    		console.log("[mouseup] mouseup_node=not null ");
    	} else {}

    	// clear mouse event vars
    	resetMouseVars();

    	redraw();
    }



    function resetMouseVars() {
    	console.log("resetMouseVars");

    	dragged = null;
    	mousedown_node = null;
    	mouseup_node = null;
    	mousedown_link = null;
    }

    function dragstart(d, i) {

    	if (lineappendmode)
    		return;

    	console.log("dragstart");
    	force.stop(); // stops the force auto positioning before you start dragging
    }

    function dragmove(d, i) {
    	//console.log("dragmove");
    	if (lineappendmode)
    		return;

    	if (dragged) {
    		d.px += d3.event.dx;
    		d.py += d3.event.dy;
    		d.x += d3.event.dx;
    		d.y += d3.event.dy;
    		tick2(); // this is the key to make it work together with updating both px,py,x,y on d !
    	}
    }

    function dragend(d, i) {
    	if (lineappendmode)
    		return;

    	if (dragged) {
    		console.log("dragend");

    		d.fixed = true; // of course set the node to fixed so the force doesn't include the node in its auto positioning stuff
    		tick2();
    		force.resume();
    	}
    	dragged = false;
    }



    function tick() {
    	console.log("called function tick() ")
    	link.attr("x1", function (d) {
    			return d.source.x;
    		})
    		.attr("y1", function (d) {
    			return d.source.y;
    		})
    		.attr("x2", function (d) {
    			return d.target.x;
    		})
    		.attr("y2", function (d) {
    			return d.target.y;
    		});

    	node.attr("cx", function (d) {
    			return d.x;
    		})
    		.attr("cy", function (d) {
    			return d.y;
    		});

    	//node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    }


    function tick2() {
    	console.log("called function tick2() ")
    	link.attr("x1", function (d) {
    			return d.source.x;
    		})
    		.attr("y1", function (d) {
    			return d.source.y;
    		})
    		.attr("x2", function (d) {
    			return d.target.x;
    		})
    		.attr("y2", function (d) {
    			return d.target.y;
    		});

    	//node.attr("cx", function(d) { return d.x; }).attr("cy", function(d) { return d.y; });

    	node.attr("transform", function (d) {
    		return "translate(" + d.x + "," + d.y + ")";
    	});
    }

    function createLink(from, to) {
    	var source = d3.select("[id=\"" + from + "\"]").datum(),
    		target = d3.select("[id=\"" + to + "\"]").datum(),
    		newLink = {
    			source: source,
    			target: target,
    			value: 1
    		};

    	//force.links().push(newLink);
    	links.push(newLink);

    	console.log("[topologyh_man] [createLink] source=" + source.id + " , target=" + target.id);
    }


    function appendNewDevice(devicename, hostname, x, y, icon_image) {
    	var data = {
    		"id": 0,
    		"name": "",
    		"group": 1,
    		"icon": "/map/icon/MICO001N1.png",
    		"x": 30,
    		"y": 10
    	};


    	var objid = submapid + '_' + hostname + '_' + Math.floor((Math.random() * 1000000) + 1);
    	console.log("[topologyh_man] appendNewDevice. devicename=" + devicename + ", hostname=" + hostname + ", icon_image=" + icon_image);

    	var submapWidth = document.getElementById('submaptree').offsetWidth;
    	if (x > submapWidth)
    		data.x = x - submapWidth;
    	else
    		data.x = 0;
    	data.y = y;
    	data.id = objid;
    	data.name = devicename;
    	data.icon = icon_image;
    	data.host_name = hostname;
    	//{"name":"Myriel","group":1, "icon": "MICO001C1.png", "x":10, "y":10},


    	var node = findNode(hostname);
    	if (node) {
    		alert("Already registered device.")
    		return;
    	}


    	InsertNodeInfo(objid, devicename, hostname, x, y, icon_image);
    	console.log("[topologyh_man] appendNewDevice. x=" + data.x + " , y=" + data.y + ", y=" + y);

    	nodes.push(data);

    	redraw();

    } //end.  function appendNewDevice(devicename, hostname, x, y)


    function InsertNodeInfo(objid, devicename, hostname, x, y, icon_image) {
    	var hname = hostname;
    	var formData = [];


    	formData.push({
    		h_objid: objid,
    		m_id: submapid,
    		host_alias: devicename,
    		h_caption: devicename,
    		host_name: hostname,
    		h_left: x,
    		h_top: y,
    		h_imagefilename: icon_image
    	});

    	$.ajax({
    		url: '/map/appendnode.do',
    		type: 'POST',
    		dataType: 'json',
    		contentType: 'application/json',
    		data: JSON.stringify(formData),
    		cache: false,
    		async: false,
    		success: function (data) {
    			alert('[Success] insert node = ' + devicename);
    		},
    		error: function () {
    			alert('[Error] Fail to insert node. ' + devicename);
    			return false;
    		}
    	}).done(function (msg) {
    		//alert( "Data Saved: " + msg );   
    	});

    	return true;
    } //end. function InsertNodeInfo(objid, devicename, hostname, x, y)


    function RemoveNodeInfo(objid, devicename) {
    	// var hname=hostname;
    	var formData = [];

    	//var objid = submapid + '_' + hostname + '_' + Math.floor((Math.random() * 1000000) + 1);
    	formData.push({
    		m_id: submapid,
    		h_objid: objid
    	});

    	$.ajax({
    		url: '/map/removenode.do',
    		type: 'POST',
    		dataType: 'json',
    		contentType: 'application/json',
    		data: JSON.stringify(formData),
    		cache: false,
    		async: false,
    		success: function (data) {
    			alert('[Success] remove node = ' + devicename);
    		},
    		error: function () {
    			alert('[Error] Fail to remove node. ' + devicename);
    			return false;
    		}
    		//});
    	}).done(function (msg) {
    		alert("Data Saved: " + msg);
    	});

    	return true;
    } //end. function RemoveNodeInfo(objid)

    function InsertLineInfo(objid, fromhost, fromid, tohost, toid) {
    	//var hname=hostname;
    	var formData = [];


    	formData.push({
    		l_objid: objid,
    		m_id: submapid,
    		l_fromhost: fromhost,
    		l_tohost: tohost,
    		l_fromobjid: fromid,
    		l_toobjid: toid
    	});

    	$.ajax({
    		url: '/map/appendline.do',
    		type: 'POST',
    		dataType: 'json',
    		contentType: 'application/json',
    		data: JSON.stringify(formData),
    		cache: false,
    		async: false,
    		success: function (data) {
    			alert('[Success] insert line. from=' + fromhost + ", to=" + tohost);
    		},
    		error: function () {
    			alert('[Error] Fail to insert line. from=' + fromhost + ", to=" + tohost);
    			return false;
    		}
    	}).done(function (msg) {
    		//alert( "Data Saved: " + msg );   
    	});

    	return true;
    } //end. function Insertlineinfo

    function RemoveLineInfo(objid) {
    	// var hname=hostname;
    	var formData = [];

    	//var objid = submapid + '_' + hostname + '_' + Math.floor((Math.random() * 1000000) + 1);
    	formData.push({
    		m_id: submapid,
    		l_objid: objid
    	});

    	$.ajax({
    		url: '/map/removeline.do',
    		type: 'POST',
    		dataType: 'json',
    		contentType: 'application/json',
    		data: JSON.stringify(formData),
    		cache: false,
    		async: false,
    		success: function (data) {
    			alert('[Success] remove line. objid=' + objid);
    		},
    		error: function () {
    			alert('[Error] Fail to remove line. objid=' + objid);
    			return false;
    		}
    		//});
    	}).done(function (msg) {
    		alert("Data Saved: " + msg);
    	});

    	return true;
    } //end. function RemoveLineInfo(objid)


    function SaveTopologyMAP() {
    	// var hname=hostname;
    	var formData = [];
    	var nodeMap = {};
    	var i = 0;

    	//var objid = submapid + '_' + hostname + '_' + Math.floor((Math.random() * 1000000) + 1);
    	//nodes = svg.selectAll(".node");
    	// node = node.data(nodes, function (d) { return d.name; });

    	nodes.forEach(function (d) {
    		nodeMap[d.id] = d;

    		if (typeof nodeMap[d.id] != 'undefined') {
    			//console.log("l.source undefined id=" + nodeMap[l.source]);
    			console.log("[node] " + i + " objid=" + d.id + ", name=" + d.name +
    				", x=" + d.x +
    				", y=" + d.y +
    				", icon_image=" + d.icon +
    				", host_name=" + d.host_name
    			);

    			formData.push({
    				h_objid: d.id,
    				m_id: submapid,
    				host_alias: d.name,
    				h_caption: d.name,
    				host_name: d.host_name,
    				h_left: d.x,
    				h_top: d.y,
    				h_imagefilename: d.icon
    			});
    			i++;
    		}
    	});


    	$.ajax({
    		url: '/map/updatenode.do',
    		type: 'POST',
    		dataType: 'json',
    		contentType: 'application/json',
    		data: JSON.stringify(formData),
    		cache: false,
    		async: false,
    		success: function (data) {
    			alert('[Success] update topologymap ');
    		},
    		error: function () {
    			alert('[Error] Fail to update topologymap. ');
    			return false;
    		}
    	}).done(function (msg) {
    		//alert( "Data Saved: " + msg );   
    	});

    	/*
        $.ajax({
        	url: '/map/removenode.do',
        	type: 'POST',
        	dataType:'json',
        	contentType:'application/json',
			data : JSON.stringify(formData),
			cache:false,
			async: false,
			success: function(data) 
        	{ 
        		alert('[Success] remove node = ' + devicename);
        	},
        	error: function() 
        	{ 
        		alert('[Error] Fail to remove node. ' + devicename);
        		return false;
        	}
       //});
	      }).done(function( msg ) {   
            alert( "Data Saved: " + msg );   
        });  
*/
    	return true;
    } //end. function RemoveNodeInfo(objid)

    // redraw force layout
    function redraw() {
    	console.log("[redraw] redraw force layout");

    	/* 기존에 등록된 오브젝트 삭제  */
    	svg.selectAll(".link").remove();
    	svg.selectAll(".node").remove();

    	node = svg.selectAll(".node");
    	link = svg.selectAll(".link");

    	link = link.data(links, function (d) {
    		return d.source.id + "-" + d.target.id;
    	});
    	//link.enter().insert("line", ".node")


    	link.enter().append("path")
    		.attr("class", "link")
    		//.attr("marker-end", "url(#Triangle)")
    		.on("mousedown", function (d) {
    			mousedown_link = d;
    			selected_link = d;
    			selected_node = null;

    			console.log("[redraw] link mousedown =" + d.source.id);

    			redraw();
    		});

    	link.exit().remove();
    	link.classed("link_selected", function (d) {
    		return d === selected_link;
    	});

    	//node = node.data(nodes);
    	node = node.data(nodes, function (d) {
    		return d.name;
    	});
    	//node.enter().insert("circle")
    	node.enter().append("g")
    		.attr("class", "node")
    		//.attr("r", 5)
    		.attr("id", function (d) {
    			return d.id;
    		})
    		//.on('contextmenu', d3.contextMenu(menu))
    		//.call(force.drag)           //shryu-1
    		.call(node_drag)
    		.on("dblclick", function (d) {
    			alert("dblclick");
    		})
    		.on("mousedown", function (d) {
    			mousedown_node = d;
    			selected_node = d;
    			selected_link = null;
    			console.log("[redraw] mousedown node mousedown =" + d.name);
    			redraw();
    		})
    		.on("mouseup", function (d) {
    			//selected_node = d;
    			mouseup_node = d;
    			//redraw();      //=> context_menu로 인해 Disable 
    		});
    	node.exit().remove();
    	node.classed("node_selected", function (d) {
    		return d === selected_node;
    	});

    	/*
  	  	node.append("image")
	    	.attr('x', -8)
	    	.attr('y', -8)
	    	.attr('width', 24)
	    	.attr('height', 24)
	    	.on('contextmenu', d3.contextMenu(menu))
	    	.attr("xlink:href", function (d) { return d.icon });
			//.call(force.drag);           // 드래그시  Node fixed가 되지 않는다.
			*/

    	/*
		node.append("image")
	    	.attr('x', -(nImageWidth/2))         //연결선의 중심위치때문에 이미지위치를 왼쪽으로 이동
	    	.attr('y', -(nImageHeight/2))        //연결선의 중심위치때문에 이미지위치를 아래로 이동 
	    	.attr('width', nImageWidth)
	    	.attr('height', nImageHeight)
	    	.on('contextmenu', d3.contextMenu(menu))
	    	.attr("xlink:href", function (d) { return d.icon });
			//.call(force.drag);           // 드래그시  Node fixed가 되지 않는다.
			
	  	node.append("text")
	    	.attr("dx", 0)
	    	.attr("dy", nImageHeight/2)
	    	.attr('text-anchor', "middle")
	    	//.attr("dx", 12)
	    	//.attr("dy", ".35em")
	    	//.attr('dx', function (d) { return d.x; })
            //.attr('dy', function (d) { return d.y; })
	    	.text(function (d) {
	        //console.log("[" + i + "] ----" + d.name);
	        	i++;
	        	return d.name
	    	});
			*/



    	node.append("image")
    		.attr('x', -(nImageWidth / 2)) //연결선의 중심위치때문에 이미지위치를 왼쪽으로 이동
    		.attr('y', -(nImageHeight / 2)) //연결선의 중심위치때문에 이미지위치를 아래로 이동
    		.attr('width', nImageWidth)
    		.attr('height', nImageHeight)
    		.on('contextmenu', d3.contextMenu(nodemenu))
    		.attr("xlink:href", function (d) {
    			return d.icon
    		})
    		.attr('background', 'red')
    		.call(force.drag); // 드래그시  Node fixed가 되지 않는다.

    	node.append("text")
    		.attr("dx", 0)
    		.attr("dy", nImageHeight / 2)
    		//.attr("dy", 0)
    		.attr('text-anchor', "middle")
    		//.attr("dx", 12)
    		//.attr("dy", ".35em")
    		//.attr('dx', function (d) { return d.x; })
    		//.attr('dy', function (d) { return d.y; })
    		.text(function (d) {
    			//console.log("[" + i + "] ----" + d.name);
    			i++;
    			return d.name
    		});


    	if (d3.event) {
    		// prevent browser's default behavior
    		d3.event.preventDefault();
    	}

    	/*
 	  function tick2() 
  	{
  		console.log("called function tick2() ")
  		link.attr("x1", function(d) { return d.source.x; })
  	    	.attr("y1", function(d) { return d.source.y; })
  	      	.attr("x2", function(d) { return d.target.x; })
  	      	.attr("y2", function(d) { return d.target.y; });

  	  	//node.attr("cx", function(d) { return d.x; }).attr("cy", function(d) { return d.y; });
  	  	
  	    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  	}

 	  */

    	force.on("tick", function () {

    		console.log("called function redraw tick() ")


    		/*
  	  		link.attr("x1", function (d) { return d.source.x; })
			    .attr("y1", function (d) { return d.source.y; })
			    .attr("x2", function (d) { return d.target.x; })
			    .attr("y2", function (d) { return d.target.y; });
  */

    		link.attr("d", function (d) {
    			var dx = d.target.x - d.source.x,
    				dy = d.target.y - d.source.y,
    				dr = Math.sqrt(dx * dx + dy * dy);
    			return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
    		});

    		//node.attr("cx", function (d) { return d.x; })
    		//	.attr("cy", function (d) { return d.y; });

    		node.attr("transform", function (d) {
    			return "translate(" + d.x + "," + d.y + ")";
    		});


    		//console.log("[redraw] froce.on called");
    		//node.attr("fixed", false);
    	}); // end.  force.on("tick", function () {

    	force.start();

    } //end function redraw() 


    function spliceLinksForNode(node) {
    	toSplice = links.filter(function (l) {
    		return (l.source === node) || (l.target === node);
    	});
    	toSplice.map(function (l) {
    		links.splice(links.indexOf(l), 1);
    	});
    } // end. function spliceLinksForNode(node) {


    function keydown() {
    	if (!selected_node && !selected_link) return;

    	switch (d3.event.keyCode) {
    		case 8: // backspace
    		case 46:
    			{
    				if (!mapmode_edit)
    					return;

    				// delete
    				if (selected_node) {
    					var retVal = confirm("선택한 장비['" + selected_node.name + "]를 삭제하시겠습니까  ?");
    					if (retVal == true) {

    						console.log("selected node = " + selected_node.id + ", name=" + selected_node.name);

    						RemoveNodeInfo(selected_node.id, selected_node.name);
    						nodes.splice(nodes.indexOf(selected_node), 1);
    						spliceLinksForNode(selected_node);
    					}
    				} else if (selected_link) {
    					var retVal = confirm("선택한 연결선을 삭제하시겠습니까  ?");
    					if (retVal == true) {

    						console.log("selected link = " + selected_link.id);
    						RemoveLineInfo(selected_link.id);

    						links.splice(links.indexOf(selected_link), 1);
    					}
    				}
    				selected_link = null;
    				selected_node = null;

    				redraw();
    				break;
    			} //end. case 46: 
    	} //end. switch (d3.event.keyCode) {
    }


    function getSubmapInfo(selectmapid) {


    	// Get the data again
    	var map_url = "/map/getTopologyMap.do?m_id=" + selectmapid;

    	console.log("[getSubmapInfo] select submap. ----------map data url = " + map_url);
    	d3.json(map_url, function (error, graph) {

    		/* 기존에 등록된 오브젝트 삭제  */
    		svg.selectAll(".link").remove();
    		svg.selectAll(".node").remove();

    		if (error) {
    			console.log("[getSubmapInfo] error. message=" + error);

    			alert("[error] " + error);

    			stopFaultmon();
    			refreshPage('/index.do');

    			return;
    			//throw error;
    		}

    		/* link를 위해, d3는 link source, target이  node의 index이므로  재배열*/
    		var nodeMap = {};

    		graph.nodes.forEach(function (d) {
    			nodeMap[d.id] = d;
    		});
    		graph.links.forEach(function (l) {

    			if (typeof nodeMap[l.target] === 'undefined') {
    				//console.log("l.source undefined id=" + nodeMap[l.source]);
    				console.log("[getSubmapInfo] l.source undefined id=" + l.target);
    			} else {
    				l.target = nodeMap[l.target];
    			}
    			if (typeof nodeMap[l.source] === 'undefined') {
    				console.log("[getSubmapInfo] l.source undefined id=" + l.source);
    				//console.log("l.source undefined id=" + l.target);
    			} else {
    				l.source = nodeMap[l.source];
    			}
    		}); // end.  graph.links.forEach(function (l)


    		var link = svg.selectAll(".link")
    			.data(graph.links)
    			.enter().append("path")
    			.attr("class", "link")
    			.attr("weight", 2)
    			//.attr("x1", function (d) { return d.source.x+nImageWidth/2; })
    			//.attr("y1", function (d) { return d.source.y+nImageHeight/2; })
    			//.attr("x2", function (d) { return d.target.x+nImageWidth/2; })
    			//.attr("y2", function (d) { return d.target.y+nImageHeight/2; })
    			.style("stroke-width", function (d) {
    				return Math.sqrt(d.value);
    			});

    		var node = svg.selectAll(".node")
    			.data(graph.nodes)
    			//.enter().append("circle")
    			.enter().append("g")
    			//.on("click", function (d) { d.fixed = true })
    			.attr("class", "node")
    			.attr("id", function (d) {
    				return d.id;
    			})
    			.call(node_drag)
    			.on("mousedown", function (d) {
    				mousedown_node = d;
    				selected_node = d;
    				selected_link = null;

    				console.log("[getSubmapInfo mouse] node mousedown =" + d.name);

    				redraw();
    			})
    			.on("mouseup", function (d) {
    				//selected_node = d;
    				mouseup_node = d;
    				console.log("[getSubmapInfo mouse] node mouseup =" + d.name);
    				redraw();
    			}); //end.  var node 

    		node.append("image")
    			.attr('x', function (d) {
    				return d.x;
    			})
    			.attr('y', function (d) {
    				return d.y;
    			})
    			.attr('width', nImageWidth)
    			.attr('height', nImageHeight)
    			.on('contextmenu', d3.contextMenu(menu))
    			.attr("xlink:href", function (d) {
    				return d.icon
    			});
    		//.call(force.drag);           // 드래그시  Node fixed가 되지 않는다.

    		node.append("text")
    			.attr('dx', function (d) {
    				return d.x + nImageWidth / 2;
    			})
    			.attr('dy', function (d) {
    				return d.y + nImageHeight;
    			})
    			.attr('text-anchor', "middle")
    			//.attr("dy", ".35em")
    			//.attr("dy", nImageHeight)
    			//.attr("y", 15)
    			//.text(function (d) { console.log("[" + i + "] ----" + d.name); return d.name })
    			.text(function (d) {
    				return d.name
    			});

    		i++;

    		nodes = graph.nodes;
    		links = graph.links;

    		console.log("[getSubmapInfo json]  graph.nodes size=" + graph.nodes.length);
    		console.log("[getSubmapInfo json]  graph.links size=" + graph.links.length);

    		redraw();

    	});
    	return;
    }

    function alarmSound(alarmlevel) {
    	alarmSoundStop();

    	if (alarmlevel === 2)
    		warning.play();
    	else if (alarmlevel === 3)
    		minor.play();
    	else if (alarmlevel === 4)
    		major.play();
    	else if (alarmlevel === 5)
    		critical.play();
    }

    function alarmSoundStop() {
    	warning.pause();
    	minor.pause();
    	major.pause();
    	critical.pause();
    }