
var focus_running = 0;
var timeLine = [];
var count = 0;
var sentiment = 0;

document.getElementById("localVideo").style.display = "none"; 

function focus_sample()
{
	if(focus_running == 1)
	{
		var info = document.getElementById("bigFeed").getElementsByTagName("video").id;

		// If sentiment hasn't changed we haven't started affdex sampling yet.
		if(sentiment != 0)
		{			
			var sample_element = {"timeValue":count,
			                      "focus":info,
			                      "sentiment": sentiment};
			console.log(sample_element);
			timeLine.push(sample_element);
			count++;
		}
	}
}

function focus_end()
{
	focus_running = 0;

	var request = new XMLHttpRequest();
	request.onreadystatechange = function() 
	{
		if(request.readyState == 4 && request.status == 200) 
		{
			console.log(request.response);
		}
	};
	
	data_to_send = {'session_key':realFaces.sessionKey, 
					'user':realFaces.userName,
					'data':timeLine};
							
	string_data = JSON.stringify(data_to_send);				
					
	request.open('POST', 'https://conference.eastus.cloudapp.azure.com/RocConf/serverapi.php?mode=affdexupload');				
	request.setRequestHeader("Content-type", "application/json");			
	request.send(string_data);

}

