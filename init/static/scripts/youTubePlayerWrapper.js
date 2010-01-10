
//wrappers the youtube player for use in mixtree
function youTubePlayerWrapper()
{
	this.curPlayingLink = undefined;
	this.parentLi = undefined;
	this.player = undefined;
    this.enlarged = false;

	//css to apply dependng on state
	this.css = 
	{
		norm: 'sm2_link',  // default state
		loading: 'sm2_loading',
		playing: 'sm2_playing',
		paused: 'sm2_paused'
	}
	this.defaultClasses = "playlistEntry " + this.css.norm;

	this.init = function()
	{
		//this.player = document.getElementById("ytplayer");
		//this.player = $("#ytplayer").get(0);
        var tem = $("#ytplayer");
        if(tem.length == 0)
        {
            $("body").append("<div id='ytFrame'><div id='ytapiplayer'>You need Flash player 8+ and JavaScript enabled to view this video.</div><div id='ytplayerControls'><a href='#' id='enlarge' onclick='ytWrapper.toggleEnlarge()'>+/-</a></div></div>");
            var params = { allowScriptAccess: "always" };
            var atts = { id: "ytplayer" };
            swfobject.embedSWF("http://www.youtube.com/apiplayer?enablejsapi=1&playerapiid=ytplayer", 
                       "ytapiplayer", "150", "100", "8", null, null, params, atts);
             this.player = $("#ytplayer").get(0);
        }else 
            this.player = tem.get(0);       
   	}

    //returns if the player is currently on in the dom
    this.isPlayerPresent = function()
    {
        if(!this.player || $("#ytplayer").length == 0)
            return false;
        else
            return true;
    }    

    //handles a click on a youtube link
    this.handleClick = function(o)
    {
        if(! this.isPlayerPresent())
        {     
            this.init();
            this.playVideoAfterReload(o);
        }else
        {
            var curTrack = this.player.getVideoUrl();
            var state = this.player.getPlayerState();
            //first check that the youtube link clicked on isn't for a different video or nothing has been loaded
            if(state == -1 || (curTrack && curTrack.indexOf(o.id) == -1))
    	        this.playVideoAfterReload(o);
            //check if this video is already playing
            else if(state == 1)
           	    this.pause();
            //finally check if the video is paused or stopped
            else if(state == 2 || state == 5)
    	        this.play();
        }
    }

    //cues up the passed in video link in the wrapper 
    //and once the ytplayer re inits it will play the video
	this.playVideoAfterReload = function(o)
	{
		this.curPlayingLink = $(o);
		this.parentLi = this.curPlayingLink.parent();
        this.parentLi.append($("#ytFrame"));
	}

    //queues the video and plays
    this.queueAndPlayCurrent = function()
    {
        this.player.cueVideoById(this.curPlayingLink.attr('id'), 0);
        this.play();
    }

    //plays the currently cueued video and preforms class manipulations to show that the video is playing
	this.play = function()
	{
        this.player.playVideo();
		this.resetStateClasses();
		this.parentLi.addClass(this.css.playing);
	}

    //returns the state of the wrapper in regards to it containing a link to play
    this.isReadyToPlay = function()
    {
        if(this.curPlayingLink)
            return true;
        else
            return false;
    }

	this.pause = function()
	{
		this.resetStateClasses();
		this.parentLi.addClass(this.css.paused);
		this.player.pauseVideo();
	}

	this.stop = function()
	{
		this.resetStateClasses();
		this.player.stopVideo();
        this.player = false;
        $("#ytFrame").remove();
	}

	this.unload = function()
	{
        if(this.isPlayerPresent())
    	    if(this.player.getPlayerState() != 5)
            {
                this.player.clearVideo();	
    	    	this.stop();
            }
	}

	this.resetStateClasses = function(link)
	{
		var parentLi;
		if(link)
			parentLi = $(link).parent();
		else
			parentLi = this.parentLi;
		if(parentLi)
		{
			parentLi.removeClass();
			parentLi.addClass(this.defaultClasses);
		}
	}

    //enlarges or minimizes the ytplayer window
    this.toggleEnlarge = function()
    {
        var player = $("#ytplayer");
        if(this.enlarged)
        {
            player.attr('height', '100px');
            player.attr('width', '150px');
        }else
        {
            player.attr('height', '200px');
            player.attr('width', '300px');
        }

        this.enlarged = !this.enlarged;
        return false;
    }
}

var ytWrapper = new youTubePlayerWrapper();

//youtube player onready
//this will play the video that the wrapper contaiins.  This is to get around
//the player being destroyed durring dom manipulations
function onYouTubePlayerReady(playerId) 
{
    //ytWrapper.init();
    ytWrapper.player.addEventListener("onStateChange", "onytplayerStateChange");
    if(ytWrapper.isReadyToPlay())
       ytWrapper.queueAndPlayCurrent()    
}

function onytplayerStateChange(state) 
{
	//play the next element in the playlist
	if(state == 0)
	{
		//find the next link
		var nextLi = $(ytWrapper.curPlayingLink).parent().next();
		//check if there is any more playlist elements
		if(nextLi.length > 0)
		{
			//stop current song
			ytWrapper.stop();
			var next = nextLi.children("a").filter(".playable").get(0);
			//next song
			pagePlayer.handleClick({target:next});
		}else
			ytWrapper.stop();
	}
}
