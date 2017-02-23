<?php
  $feedbackID = $_GET['key'];
  $userID = $_GET['user'];
?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Chat</title>
	<link rel="stylesheet" type="text/css" href="https://cdn.rawgit.com/daneden/animate.css/master/animate.min.css">
	<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.5/css/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="chat/public/css/style.css">
	<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css">

	<script src="https://code.jquery.com/jquery-1.11.1.js"></script>
	<script src="https://code.jquery.com/ui/1.12.0/jquery-ui.js"></script>
	<script src="fusioncharts/fusioncharts.js"></script>
	<script src="fusioncharts/fusioncharts.charts.js"></script>
	<script src="fusioncharts/fusioncharts.widgets.js"></script>

	<!--script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script-->

</head>

<body>
	<header>
		<nav class="navbar navbar-dark">
      		<div class="container-fluid">
        		<a class="navbar-brand" href="#">
    				<img src="Real-Faces/static/images/coco.png" class="img-fluid" alt="">
        		</a> 
        		<div class="header-title">
        			<h1>Feedback Assistant</h1>
        		</div>
     		</div>
  		</nav>
	</header>
	<div class="main">
			<div class="contain-body">
		  		<div class="inner-contain-body">
		     		<ul id="messages">
		  			</ul>
		    		<div class="clr"></div>
		  		</div>
		  		<div id="message-option" class="message-option">
		  		</div>
			</div>
			<div class="contain-graph">
				<div class="container-layer">
					<!-- actual feedback diagram -->
					<div id="graphContainer" class="inner-contain-graph">
						<!-- some kind of navigation instruction -->
 
			 		<div id="accordion">
						<!--h3>Interruption</h3>
				 		<div class="graph-container">
				        <div class="outer">
				          <p><span class="chart-label" id="chart1"></span>
				          </p>
				          <p>By You</p>
				        </div>
				        <div class="outer">
				          <p><span class="chart-label" id="chart2"></span>
				          </p>
				          <p>By Others</p>
				        </div>
				        </div>
						<h3>Participation</h3>
						<div class="graph-container">
						<div class="outer2">
							<canvas class="chart" id="chart3" data-value="0" data-speaker=""></canvas>
						</div>
						</div>
						<h3>Turn Taking</h3>
						<div class="graph-container">
							<div class="inner-contain3" id="chart4" data-value="0" data-user=""></div>
						</div-->
			      	</div>
					</div>
				</div>
			</div>
	</div>

	<script src="graphs/public/js/jquery.animateNumber.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.2.1/Chart.js"></script>
    <script src="https://cdn.rawgit.com/adobe-webplatform/Snap.svg/master/dist/snap.svg-min.js"></script>
    <script src="graphs/public/main.js"></script>	
    <script src="chat/public/talktimeDialogue.js"></script>
    <script type="text/javascript">
			//Where it all begins...
			var defaultfeedback = <?php echo json_encode($feedbackID); ?>;
			var defaultuser = <?php echo json_encode($userID); ?>;
			var session = <?php 
				if(isset($_GET['session'])){
					echo json_encode($_GET['session']);
				}else{
					echo json_encode('invalid');
				}
			?> || 'NaN';
			//creating ellipsis
			var thinking = $('#messages li:last');
			var thinkingflag = 0;
			var countdelay  = 1;
			var gg = 'im gg';
    </script>
    <script src="chat/public/testscript.js?onload=load"></script>
</body>
</html> 
