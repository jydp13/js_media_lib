var player={
	actual_player:null,
	player_type:null,
	player_width:null,
	player_height:null,
	player_style:null,
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
									"<div id='display'>"+
										"<video id='video' src='"+this.video_file+"' type='"+this.video_type+"' width="+player.player_width+"px height='"+player.player_height+"px'></div>"+
									"<div id='menu'>"+
										"<div id='progressbar' style='border: solid;height: 5px;width:"+player.player_width+"px;'>"+
											"<div id='progress'></div>" +
										"</div>"+
										"<button type='button' onclick='player.service(this.innerHTML)'>Play</button>"+
						 				"<button type='button' onclick='player.service(this.innerHTML)'>Pause</button>"+
						 				"<button type='button' onclick='player.service(this.innerHTML)'>Restart</button>"+
						 				"<button type='button' id='mute_unmute_button' onclick='player.service(this.innerHTML)'>Mute</button>"+
									"</div>"
								"</div>";
			return this.video_player;	
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
		stop:function(){
			clearInterval(this.id);
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
		if (user_input=="Play") {
			this.progressbar.start();
			this.actual_player.play();
		}else if (user_input=="Pause") {
			this.progressbar.stop();
			this.actual_player.pause();
		}else if (user_input=="Restart") {
			this.actual_player.currentTime=0;
			this.service("Play");
		}else if (user_input=="Mute") {
			this.actual_player.muted=true;
			mute_unmute_button.innerHTML="Unmute";
		}else if (user_input=="Unmute") {
			this.actual_player.muted=false;
			mute_unmute_button.innerHTML="Mute";
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
		this.player_width=player_width;
		this.player_height=player_height;
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