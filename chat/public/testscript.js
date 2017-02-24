window.onload = load;

/*-----variable declarations-----*/
var participation = parse(json); //**we are going to alter this line, participation is not the first

var i1, i2, i3, i4, i3speaker, i3data, iuser; //graph data i stands for index
var guests;
var colorpalette;

var smile_graph_data = [];
var session_data = [];		
var single_smile_data = [];

//participation percentage, turn most, emotional self, emotional all, share most, 
var  participatePercent, turnMost, turnLeast, selfEmo, allEmo,  shareMost, shareLeast;

var countType = 0;
var graphType = ["participation", "interruption", "turntaking", "valence", "attitude", "smilesharing"];

//equal to document.ready
function load() {
	console.log('im in onload', json, thinkingflag, defaultfeedback, defaultuser, session);
	//**we will alter the below line so it does not start from the first
	gotoObject(participation[Object.keys(participation)[0]]); //start from the initial item on the list
	gatherData();
}

/*-----dialogue functions -----*/
function gotoObject(object){

	var graphResponse = ["As you can see from the graph, you participated <span class='dynotext'>" + participatePercent + "%</span> of the whole session. Expressing your ideas contributes in group decision. Would you like to know more about it?", 
	"From the analysis, you overlapped <span class='dynotext'>" + i2 + "</span> times with other's speeches. On the other hand, your speech got overlapped <span class='dynotext'>" + i1 + "</span> times by the group.",
	"You spoke after <span class='dynotext'>" + turnMost + "</span> most of the time and <span class='dynotext'>" + turnLeast + "</span> least of the time.",
	"Your overall emotion was <span class='dynotext'>" + selfEmo + "</span> during the session.",
	"Here goes your overall attitude towards others throughout the whole conversation.",
	"You shared most smiles with <span class='dynotext'>" + shareMost + "</span>, and least with <span class='dynotext'>" + shareLeast + "</span>."];
	//On average, the team was emotionally" + allEmo + "."
	document.getElementById('message-option').innerHTML="";
	
	// console.log(participation, object.title);

	//Dealing with undefined everything error occur
	if(typeof object.body == undefined || typeof object.title == undefined){
		(function(str){
			setTimeout(function(){
				$('#messages').append(new item("Server", str).create());	
			},1500);
		})('server crashed, please email us at xxx@xxx.edu to report your problem');
	}else{
		console.log('message content ', object.body.length); //already trimmed
		console.log('the buttons ', object.buttons); //buttons

		fixNewline(object);
		if(participation[object.title].tags=='1'){
			thinkingflag = 1;
			setTimeout(function(){
			//	$('#messages').append(new item("Roboto","...").create());
			//	thinking= $('#messages li:last');

				$('#messages').append("<img src='https://codemyui.com/wp-content/uploads/2015/06/iMessage-Typing-Indicator-in-CSS.gif' height=120 width=200>")
				thinking= $('#messages img:last');

				// scroll to last message bubble
				$('.inner-contain-body').animate({ 
					scrollTop: $('#messages').height()
				});

			},countdelay*400);

			countdelay+=1.7;

			setTimeout(function(){
				createGraph(graphType[countType]);
				thinking.remove(); 
				
				// replace ellipsis with Roboto's reply
				$('#messages').append(new item("Roboto", graphResponse[countType]).create());	
				countType++;

				// scroll to last message bubble
				$('.inner-contain-body').animate({ 
					scrollTop: $('#messages').height()
				});

			},(countdelay)*1000);

			countdelay+=3.5;	

			console.log('when empty1 ',countdelay);
			console.log('when thinkingflag ',thinkingflag);
		}
		else
			thinkingflag = 0;
	}
}

//dialogue fixing newline
function fixNewline(obj){
	var count = 1;
	var dialoguecount=0;
	countdelay = 1;
	
	console.log('when empty2 ',countdelay);

	for(var str of participation[obj.title].body.split(/\\n/)){
		console.log('parsed message content',str.length);
		if(!/\S/.test(str)) continue; //if its empty skip it
		(function(str){
			setTimeout(function(){ 			
				$('#messages').append(new item("Roboto", str).create());	
				$('.inner-contain-body').animate({ 
					scrollTop: $('#messages').height()
				});
			},countdelay*1000);
		})(str);// IIFE call on set a Timeout

		countdelay+=1.7;

		dialoguecount++;
	}
	
	console.log('when thinkingflag ',thinkingflag);
	console.log('when dialoguecount ',dialoguecount);
	countdelay = dialoguecount+1.7;

	console.log('whats the count ', count);
	if(obj.buttons[0]=='optionbubble'){
		console.log('i have all options!')
	}
	else if(obj.buttons){
		if((dialoguecount == 1 && thinkingflag == 0) || (dialoguecount == 0 && thinkingflag == 0))
			countdelay+=5;
		if(dialoguecount == 0 && thinkingflag == 1)
			countdelay+=1.7;
		(function(str){
			setTimeout(function(){
				for(var b of obj.buttons){
					console.log(b);
					$('#message-option').append(new option(/\[\[(.*?)\]\]/g.exec(b.trim())[1]).create());
				}	
			},(countdelay)*1000);
		})(str);//IIFE call on creating buttons
	}

	console.log('when empty4 ',countdelay);

	countdelay = 1;

}

//parse a message to object
function parse(json){
	var result = [];
	for (var element of json){
		result[element.title.trim()] = element; //assuming titles are unique
		
		//for graphs
		if(element.tags){
			result[element.title.trim()].tags = element.tags;
		} 

		//empty node which should never occur for now
		if(element.body.length==0){
			console.log('element.body fixed');
			result[element.title.trim()].body = "empty node detected!";
		}else{
			//nonempty node
			var bracket = element.body.match(/\[\[(.*?)\]\]/g); //search for bracket [[]] which are coded for buttons
			if(bracket==null){
					result[element.title.trim()].body = element.body.trim();
			}
			else{
				//there are always brackets in the message bubble
				result[element.title.trim()].buttons = element.body.match(/\[\[(.*?)\]\]/g);
				result[element.title.trim()].body = element.body.split(/\[\[/)[0];
		
			}
		}
	}
	return result;
}

/*-------button methods-------*/

//initializer
function option(o){
	this.text = o.split("|")[0];
	this.next = o.split("|")[1];
	this.button = document.createElement('button');
}

option.prototype.create = function() {
	this.button.textContent = this.text;
	this.button.setAttribute('data-next', this.next);
	if (this.button.addEventListener) 
		this.button.addEventListener('click',test,false); //everything else    
	else if (this.button.attachEvent)
		this.button.attachEvent('onclick',test);  //IE only
	return this.button;
}

// button click event
var test = function(e){
	$('#messages').append(new item("user", this.textContent).create());
	$('.inner-contain-body').animate({ 
			scrollTop: $('#messages').height()
	});
	gotoObject(participation[this.getAttribute('data-next')]);
}

/*------message bubble methods------*/

//initializer
function item(user, text) {
	this.user = user;
	this.text = text;
	this.li = document.createElement('li');
}

item.prototype.create = function() {
	var div = document.createElement('div');
	div.className = 'message-content';
	var image = document.createElement('img');
	image.className = 'profile';
	
	var right = document.createElement('div');
	right.className = 'right';
	
	var content = document.createElement('span');
	content.className = 'content';
	content.innerHTML = this.text;

	if(this.user=='Roboto'){
		//it's Roboto
		image.src='https://files.slack.com/files-pri/T1FSQC4CB-F2VN90X19/chatbot.png';//will be replaced with local img
		var left = document.createElement('div');
		left.className = 'left';
		left.appendChild(image);
	}else{
		//it's the user
		//place the bubble on the right using bootstrap class
		this.li.className="text-xs-right";
		right.className+=" user-right";
	}
	
	right.appendChild(content);
	if(left) div.appendChild(left);
	div.appendChild(right);
	this.li.appendChild(div);
	return this.li;
}
		
/*-----graph and graph data methods-----*/
function createGraph(type) {
	var graphDiv;
	switch (type) {
		case "participation":
			graphDiv = $("<div style='display:none;' class='wrapper' id='wrapper-"+type+"'><h5 class='graph-header'><span>Participation</span></h5><div id='"+type+"' class='graph-container'><div style='height:230px;'><canvas class='chart' id='chart3' data-value='0' data-speaker=''></canvas></div></div></div></div>");
			break;
		case "turntaking":
			graphDiv = $("<div style='display:none;' class='wrapper' id='wrapper-"+type+"' style='height:450px;'><h5 class='graph-header'><span>Turn Taking</span></h5><div id='"+type+"' class='graph-container' style='padding-top:12px;'><div class='inner-contain3' id='chart4' data-value='0' data-user=''></div></div></div>");
			break;
		case "smilesharing":
			graphDiv = $("<div style='display:none;' class='wrapper' id='wrapper-"+type+"'><h5 class='graph-header'><span>Shared Smile</span></h5><div id='"+type+"' class='graph-container'><div id='smile_chart'></div></div></div>");
			break;
		case "valence":
			graphDiv = $("<div style='display:none;' class='wrapper' id='wrapper-"+type+"'><h5 class='graph-header'><span>Valence</span></h5><div id='"+type+"' class='graph-container'><div id='chart6' data-value='0' data-user=''></div></div></div>");
			break;
		//**needs fixing
		case "interruption": 
			//graphDiv = $("<div style='display:none;' class='wrapper' id='wrapper-"+type+"'><h5 class='graph-header'><span>Speech Overlap</span></h5><div id='"+type+"' class='graph-container'><div class='inner-contain3' id='chart5' data-value='0' data-user=''></div></div></div>");
			graphDiv = $("<div style='display:none;color:black;' class='wrapper' id='wrapper-"+type+"'><h5 class='graph-header'><span>Speech Overlap</span></h5><div id='"+type+"' class='graph-container'><div id='chart1'></div><div id = 'chart2'></div><object data='graphs/public/svg/overlaps.svg' type='image/svg+xml' style='margin-left:30%;'><img src='graphs/public/svg/overlaps.svg' /></object></div></div>");					
			break;
		case "attitude":
			graphDiv = $("<div style='display:none;' class='wrapper' id='wrapper-"+type+"'><h5 class='graph-header'><span>Attitude Towards</span></h5><div id='"+type+"' class='graph-container'><div align='center'><canvas style='width:430px;height:220px' id='barChart' width=430 height=220></canvas></div></div></div>");
			break;
	}

	$("#accordion").append(graphDiv);

	console.log(graphDiv);	

	//**this line is not doing anything
	if(session !== 'invalid'){
		$('.wrapper').append("<a href='#' data-toggle='' title='Popover Header' data-content='Some content inside the popover'>Toggle popover</a>");
		$("[data-toggle='popover']").popover(); 
	}

	make_Graph(type);

	//graph animation
	$('.wrapper').slideDown("slow", function(){
		//slide first to obtain the height then scroll
		$('.inner-contain-graph').animate({ 
			scrollTop: $('.inner-contain-graph').prop('scrollHeight')-$('.wrapper:last').prop('scrollHeight')
		});
	});
}
		
function gatherData(){
	console.log('do i have a feedback id', defaultfeedback);
	// Gather participation data.
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", "https://conference.eastus.cloudapp.azure.com/RocConf/serverapi.php?mode=participation&session_key="+defaultfeedback, false);
	xhttp.send();
	var jscontent = JSON.parse(xhttp.responseText);
	//document.getElementById("Audio_Data").innerHTML = xhttp.responseText;
	//interruption
	var interruption = jscontent.interruption;
	//var defaultuser = Object.keys(interruption)[]; //Luis interruption['Luis']
	console.log('interruption name { values }: ', Object.keys(interruption)[defaultuser], interruption[Object.keys(interruption)[defaultuser]]);
	var interrupted = interruption[defaultuser].interrupted;
	console.log('interrupted: ', interrupted);
	var interrupting = interruption[defaultuser].interrupting;
	console.log('interrupting: ', interrupting);
	//participation
	var totalp = jscontent.participation['total'];
	var count = 0;
	for (var key in jscontent.participation){
		console.log('lala', count, key);
		if(key=='total')
			delete jscontent.participation[key]; 
		count+=1;
	}	
	var data = {};
	data.totalinterruption = interrupted+interrupting;
	data.interruption = [interrupting,interrupted];
	data.totalparticipation = totalp;
	data.participation = jscontent.participation;
	data.turntaking = jscontent.turntaking;
	data.user = defaultuser;
	console.log(data);
	var interruption = data.interruption;
	var totalinterruption = data.totalinterruption;
	var participation = data.participation;
	var totalparticipation = data.totalparticipation;
	var turntaking = data.turntaking;
	var total = total
	i1 = interruption[0];
	i2 = interruption[1];
	i3 = participation;
	//console.log('a tag ', JSON.stringify(participation,null, 2));
	i4 = turntaking;
	iuser = data.user;
	console.log("what is iuser", iuser);
	i3data = [];
	i3speaker = [];
	colorpalette = ['#90D0D5','#FBF172', '#B0D357', '#C88ABC', '#4B79BD'];
	guests = {};
	count = 0;
	console.log("i4 assignment", i4);
	for (var key in i3){
			//console.log("LALALA ", count, i3[key]);
		i3speaker.push(key);
		//keymod = key.replace(/Data\/test-key-test_/g, "");
		guests[key] = colorpalette[count];
		//console.log("logging guests", guests);
		i3data.push(Math.round(i3[key]));
		count+=1;
	}
	/*$.getScript('graphs/public/main.js',function(data,textStatus){
		console.log("load was performed. ");
	});*/
	//maketheGraphs();
		$( "#accordion" ).accordion({ header: '> div.wrapper > h5' });
	// SINGLE AND SHARED JOY DATA.
	var xhttp = new XMLHttpRequest();
	var userid = defaultuser;
	xhttp.open("GET", "https://conference.eastus.cloudapp.azure.com/RocConf/serverapi.php?mode=affdexshared&session_key="+defaultfeedback, false);
	xhttp.send();
	var jscontent = JSON.parse(xhttp.responseText);
	
	//changed smile to joy
	var single = jscontent["single_smile_data"];
	single_joy_data = {user: userid, data: single[userid]};
	
	var smile_data = jscontent["smile_data"];
	var smile_index = 0;
	for(var key in smile_data)
	{
		if(smile_data.hasOwnProperty(key))
		{
			var res = key.split(" - ");
			if(res[0] == userid || res[1] == userid)
			{
				var smile_user = "";
				
				if(res[0] != userid)
					smile_user = res[0];
				else
					smile_user = res[1];
				
				var data_point = smile_data[key];
				var element = {user: smile_user, value: data_point["Count"]};
				smile_graph_data[smile_index] = element;
				smile_index = smile_index + 1;
			}
		}
	}
	
	console.log(smile_graph_data);
	
	//Affdex Data
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", "https://conference.eastus.cloudapp.azure.com/RocConf/serverapi.php?mode=affdexaverages&session_key="+defaultfeedback+"&user="+defaultuser, false);
	xhttp.send();
	session_data = JSON.parse(xhttp.responseText);
	//setupChart("0");
		

	//dynamic participation
	var self = i3[defaultuser];
	var total = 0;
	for(var key in i3)
	{
		if(i3.hasOwnProperty(key))
		{
			total+=i3[key];
		}
	}
	participatePercent = Math.round(self/total*100);
	
	//var  participatePercent, turnMost, turnLeast, selfEmo, allEmo,  shareMost, shareLeast;

	//dynamic turntaking
	var dynoTurn = getKey(defaultuser);
	var turnTotal = dynoTurn["total"];
	var turnMostValue = 0;
	turnMost = dynoTurn["to"][0]["guest"];
	turnLeast = dynoTurn["to"][0]["guest"];
	var turnLeastValue = dynoTurn["to"][0]["guest"]/turnTotal;
	console.log("dynoTurn", dynoTurn);
	for(var i = 0; i < dynoTurn["to"].length; i++)
	{
		console.log("how about looping it here");

		if(dynoTurn["to"][i]["times"] > turnMostValue)
		{
			turnMostValue = Math.round(dynoTurn["to"][i]["times"]/turnTotal);
			turnMost = dynoTurn["to"][i]["guest"];
		}

		if(dynoTurn["to"][i]["times"] < turnLeastValue)
		{
			turnLeastValue = Math.round(dynoTurn["to"][i]["times"]/turnTotal);
			turnLeast = dynoTurn["to"][i]["guest"];
		}

	}

	//dynamic valence
	//allEmo = (session_data[""].valence+100)/2;
	selfEMo = (session_data["ALL"].valence+100)/2;
	if(selfEmo < 40)	
		selfEmo = "negative";
	else if(selfEmo > 60)
		selfEmo = "positive";
	else
		selfEmo = "neutral";

	//dynamic sharesmile
	var shareMostValue = smile_graph_data[0]["value"];
	var shareLeastValue = smile_graph_data[0]["value"];
	shareMost = smile_graph_data[0]["user"];
	shareLeast = smile_graph_data[0]["user"];

	for(var key in smile_graph_data)
	{
		if(smile_graph_data.hasOwnProperty(key))
		{
			if(smile_graph_data[key]["value"] > shareMostValue)
			{
				shareMostValue = smile_graph_data[key]["value"];
				shareMost = smile_graph_data[key]["user"];
			}

			if(smile_graph_data[key]["value"] < shareLeastValue)
			{
				shareLeastValue = smile_graph_data[key]["value"];
				shareLeast = smile_graph_data[key]["user"];
			}

		}
	}

}
