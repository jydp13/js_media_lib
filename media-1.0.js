var player={
	screen_width:screen.availWidth,
	screen_height:screen.availHeight,
	actual_player:null,
	player_type:null,
	player_width:null,
	player_height:null,
	player_style:null,
	play_status:false,
	fullscreen_status:false,
	click_count:0,
	arrow_value:0.1,
	sound_arrow_value:0.2,
	media:{
		name:null,
		type:null,
		format:null
	},
	videoplayer:{
		get:function(){
			this.video_file=player.get_media().name+"."+player.get_media().format;
			this.video_type=player.player_type+"/"+player.get_media().format;
			this.video_player="<div id='player'>"+
									"<div id='display' onclick='player.toggle(0)'>"+
										"<video id='video' src='"+this.video_file+"' type='"+this.video_type+"' width="+player.player_width+"px height='"+player.player_height+"px'></div>"+
									"<div id='menu' >"+
										"<div id='progressbar' onclick='player.service(0)' style='color:blue;border: solid;height: 5px;width:"+player.player_width+"px;'>"+
											"<div id='progress'></div>" +
										"</div>"+
										"<button type='button' id='play_pause' onclick='player.service(this.innerHTML)'>Play</button>"+
										"<button type='button'  onclick='player.service(this.innerHTML)'>Stop</button>"+
						 				"<button type='button' onclick='player.service(this.innerHTML)'>Restart</button>"+
						 				"<button type='button' id='mute_unmute_button' onclick='player.service(this.innerHTML)'>Mute</button>"+
										 "<button type='button' id='fullscreen' onclick='player.service(this.innerHTML)'>Fullscreen</button>"+
						 				"<div id=>"+
									"</div>"+
								"</div>";
			return this.video_player;	
		},
		fullscreen:function(){
   			var requestMethod = document.body.requestFullScreen || document.body.webkitRequestFullScreen || document.body.mozRequestFullScreen || document.body.msRequestFullscreen;
  			if (requestMethod) {
  				requestMethod.call(document.body); 
        		this.player_screen_util("fullscreen");
        	}
    		else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        		var wscript = new ActiveXObject("WScript.Shell");
            	if (wscript !== null) {
                	wscript.SendKeys("{F11}");
                	this.player_screen_util("fullscreen");
           		 }
        	}
    		return false;
		},
		exitfullscreen:function(){
			var requestMethod=document.exitFullscreen||document.mozCancelFullScreen||document.webkitExitFullscreen||ocument.msExitFullscreen;
			if (requestMethod) {
				requestMethod.call(document);
				this.player_screen_util("exitfullscreen");
			}else if (typeof window.ActiveXObject !== "undefined") { 
        		var wscript = new ActiveXObject("WScript.Shell");
            	if (wscript !== null) {
                	wscript.SendKeys("{F11}");
                	this.player_screen_util("exitfullscreen");
           		}
        	}
        	return false;
		},
		player_screen_util:function(input){
			var bar=document.getElementById("progressbar");
			if (input=="fullscreen") {
        		this.fullscreen_style="width:"+player.screen_width+"px;height:"+player.screen_height+"px";
        		player.actual_player.style=this.fullscreen_style;
        		bar.style="width:"+player.screen_width+"px;color:blue;border:solid;";
        		player.player_width_backup=player.player_width;
        		player.player_width=player.screen_width;

			}else if (input=="exitfullscreen") {
				this.exitfullscreen_style="width:"+player.player_width_backup+"px;"+player.player_height+"px";
				player.actual_player.style=this.exitfullscreen_style;
				bar.style="width:"+player.player_width_backup+"px;color:blue;border:solid;";
				player.player_width=player.player_width_backup;
			}
		}
		
	},
	audioplayer:{
		get:function(){
			console.log("audioplayer is not implemented yet");
		}
	},
	progressbar:{
		id:null,
		start:function(){
			this.id=setInterval(this.progress,1000);
		},
		pause:function(){
			clearInterval(this.id);
		},
		stop:function(){
			this.progress();
		},
		progress:function(){
			var percentage=(player.actual_player.currentTime*100)/player.actual_player.duration;
			var progressbar_current_width=(percentage/100)*player.player_width;
			var progressbar_style="background-color: red"+
						 ";width: "+progressbar_current_width+
						 "px;height: 5px";
			if (percentage<100){
				document.getElementById('progress').style=progressbar_style;
			}else if (percentage==100) {	
				document.getElementById('progress').style=progressbar_style;
				clearInterval(this.id);
			}
		}
	},
	service:function(user_input){
		this.actual_player=document.getElementById(this.player_type);
		var mute_unmute_button=document.getElementById("mute_unmute_button");
		var fullscreen=document.getElementById("fullscreen");
		var play_pause=document.getElementById("play_pause");
				switch(user_input){
			case "Play":
				this.progressbar.start();
				this.actual_player.play();
				play_pause.innerHTML="Pause";
				this.play_status=true;
				break;
			case "Pause":
				this.progressbar.pause();
				this.actual_player.pause();
				play_pause.innerHTML="Play";
				this.play_status=false;
				break;
			case "Restart":
				this.actual_player.currentTime=0;
				this.hour=0;
				this.minute=0;
				this.second=0;
				this.service("Play");
				break;
			case "Mute":
				this.actual_player.muted=true;
				mute_unmute_button.innerHTML="Unmute";
				break;
			case "Unmute":
				this.actual_player.muted=false;
				mute_unmute_button.innerHTML="Mute";
				break;
			case "Fullscreen":
				this.videoplayer.fullscreen();
				fullscreen.innerHTML="Exit fullscreen";
				this.fullscreen_status=true;
				break;
			case "Exit fullscreen":
				this.videoplayer.exitfullscreen();
				fullscreen.innerHTML="Fullscreen";
				this.fullscreen_status=false;
				break;
			case 0:
				var video_time=(event.clientX*this.actual_player.duration)/this.player_width;
				this.actual_player.currentTime=video_time;
				this.service("Play");
				break;
			case "Stop":
				this.service("Pause");
				this.actual_player.currentTime=this.actual_player.duration;
				this.progressbar.stop();
				break;
		}
		if(user_input=="left_arrow" || user_input=="right_arrow"){
			switch(user_input){
				case "left_arrow":
					try{
						this.actual_player.currentTime-=this.arrow_value*this.actual_player.duration
						this.service("Play");
					}catch(error){
						//console.log(error);
					}		
					break;
				case "right_arrow":
					try{
						this.actual_player.currentTime+=this.arrow_value*this.actual_player.duration;
						this.service("Play");
					}catch(error){
						//console.log(error);
					}	
					break;
			}
		}else if(user_input=="up_arrow" || user_input=="down_arrow"){
			switch(user_input){
				case "up_arrow":
					try{
						this.actual_player.volume+=this.sound_arrow_value;
					}catch(error){
						//console.log("volume out of range");
					}	
					break;
				case "down_arrow":
					try{
						this.actual_player.volume-=this.sound_arrow_value;
					}catch(error){
						//console.log("volume out of range");
					}	
					break;
			}
		}
	},
	toggle:function(input){
		if (input==0) {
			this.click_count++;
		var id=setTimeout(() =>{
			if (this.click_count==2) {
				if (this.fullscreen_status==false) {
					this.service("Fullscreen");
				}else if (this.fullscreen_status==true) {
					this.service("Exit fullscreen");
				}
				this.click_count=0;
				clearTimeout(id);
			}else if (this.click_count==1) {
				if (this.play_status==false) {
					this.service("Play");
				}else if (this.play_status==true) {
					this.service("Pause");
				}
				this.click_count=0;
				clearTimeout(id);
			}
		},500);
		}else if (input==1) {
			if (this.play_status==false) {
				this.service("Play");
			}else if (this.play_status==true) {
				this.service("Pause");
			}
		}
		
	},
	set_player:function(player_type,player_width,player_height,player_style){
		if (player_type=="audio") {
			this.actual_player=document.getElementById(player_type);
			this.player_type=player_type;
		}else if (player_type=="video") {
			this.actual_player=document.getElementById(player_type);
			this.player_type=player_type;
		}
		this.player_width=(this.screen_width/100)*player_width;
		this.player_height=(this.screen_height/100)*player_height;
		this.player_style=player_style;
	},
	get_player:function(){
		if (this.player_type=="audio") {
			return this.audioplayer.get();
		}else if (this.player_type=="video") {
			return this.videoplayer.get();
		}
	},
	set_media:function(name,type,format){
		this.media.name=name;
		this.media.type=type;
		this.media.format=format;
	},
	get_media:function(){
		return this.media;
	}
}
window.onkeydown = function(e){
   if(e.keyCode == 32 ) {
   		e.preventDefault();
    	player.toggle(1);
	}else if(e.keyCode==37 || e.keyCode==39){
		switch(e.keyCode){
			case 37:
				e.preventDefault();
				player.service("left_arrow");
				break;
			case 39:
				e.preventDefault();
				player.service("right_arrow");
				break;
		}
	}else if(e.keyCode==38 || e.keyCode==40){
		switch(e.keyCode){
			case 38:
				e.preventDefault();
				player.service("up_arrow");
				break;
			case 40:
				e.preventDefault();
				player.service("down_arrow");
				break;
		}
	}
};

