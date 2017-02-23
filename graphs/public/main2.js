//for 2nd dialogue
/* Creates graphs based on type

*/
function make_Graph(type){
	switch(type){
		case "interruption":
		    myNumber('#chart1',i1);
   			myNumber('#chart2',i2);
   			breakl
   		case "participation":
	      	ChartJS('#chart3');
	    	break;	
	    case "turntaking"
	    	createSVG();
	    	var s = Snap('#guest0');
	      	Snap.load('./graphs/public/svg/Turn_taking_bllue.svg', function(fragment){

	        //border
	        fragment.select('circle[stroke="#53C6D4"]').attr({
	          stroke: '#53C6D4',
	          strokeOpacity: .3,
	          strokeWidth: 5
	        });
	       
	        s.append(fragment);

	        var text = s.text(0,-30, 'You talked after');
	        text.attr({
	          'font-size': '30',
	          'fill': '#A7A9AC'
	        });

	        var currentUser = s.text(60,300, iuser+'');
	        currentUser.attr({
	          'visibility':'hidden',
	          '#text': iuser
	        });


	}

}
