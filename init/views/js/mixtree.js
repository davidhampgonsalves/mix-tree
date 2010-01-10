var maxResults = 10;

//gets the urls for the id spesified
//TODO: do this properly
getAudio = function(id, session)
{
	//make request to get audio
	var url = '{{= URL(r=request, c='audio_links', f='urls_by_id')}}';
	//append the id to the request
	url += '/' + id

	// make ajax request to get urls in json format
	var urls;
	$.ajax({
      		async: false,
		dataType: "json",
		url: url,
		success: function(json)
			{
				// the request will return a JSON object containing a list of urls
				urls = json[0];
			}
	});
	return urls;

}

//handles the broken url cases
audioError = function(id, url, session)
{
	alert("audio id: " + id + "(" + url + ") wasn't found");	
}

var mixListWin = null;
//adds media to the mix list
function addToMixList(id, title1, title2, type) 
{
	var url = "{{= URL(r=request, c='mix_list', f='index')}}";

	mixListWin = window.open( "", "mixList", "width=500,height=400" );
	if( !mixListWin || mixListWin.closed || !mixListWin.addMedia ) 
	{
		mixListWin = window.open( url, "mixList", "width=500,height=400");
		var mixListDelayedAdd = new MixListDelayedAdd(id, title1, title2, type);
		mixListWin.onload = mixListDelayedAdd.addToMixList;
	}else
		mixListWin.addMedia(id, title1, title2, type);
}

//class to add music to mixlist when it gets opened
function MixListDelayedAdd(id, title1, title2, type)
{
	this.id = id;
	this.title1 = title1;
	this.title2 = title2;
	this.type = type;

	this.addToMixList = function()
	{
		mixListWin.addMedia(id, title1, title2, type);
	}
}

//search all sources(mixtree, youtube)
function searchAll(searchTerm, p) 
{
    searchMixtree(searchTerm, p);
    searchYouTube(searchTerm, p)
	return false;
}

//search mixtree
function searchMixtree(searchTerm, p)
{
    var mixtreeSearchUrl = '{{= URL(r=request, c='audio', f='search')}}';
    var page = p || 0;
	$.getJSON(mixtreeSearchUrl + '/' + searchTerm + "/" + page, displayMixtreeSearchResults);

    return false;
}

//TODO: will need a closure here for paging
function searchYouTube(searchTerm, p)
{
    var page = p || 1;
	var youTubeQueryUrl = "http://gdata.youtube.com/feeds/api/videos?start-index=" + ((page * maxResults) + 1) + "&max-results=" + (maxResults + 1) + "&alt=json-in-script&v=2&callback=?&q=";
    var close = function(searchTerm, p)
    {
         var term = searchTerm;
         var page = p;
         return function(data) { displayYouTubeResults(data, term, page);}
    }(searchTerm, page);
    $.getJSON(youTubeQueryUrl + searchTerm, close);
    return false;
}

//display search results from youtube
function displayYouTubeResults(data, term, page)
{
	var entries = data.feed.entry || [];
	var youTubePlaylist = $('#youTubeSearchResults').children('ul');
	youTubePlaylist.empty();
	for(var i=0 ; i < entries.length && i < maxResults ; i++)
	{
        var entry = entries[i];
	    var playListEntry = [];
	    var j = 0;
	    playListEntry[j++] = "<li class='playlistEntry youtube'> <div class='playListControls'>";
	    playListEntry[j++] = "<a href='#' title='add to mix list' class='playListControl' onclick='";
	    playListEntry[j++] = "javascript:addToMixList(\"";
	    playListEntry[j++] = entry.media$group.yt$videoid.$t;
	    playListEntry[j++] = "\", \"";
	    playListEntry[j++] = entry.title.$t.replace('\'','');
	    playListEntry[j++] = "\",  \"\", 1)'>+</a>";
	    playListEntry[j++] = "</div>";
	    playListEntry[j++] = "<a id='";
	    playListEntry[j++] = entry.media$group.yt$videoid.$t;
	    playListEntry[j++] = "' href='#' class='playable youtube' title='play track'>";
	    playListEntry[j++] = "<img class='thumbnails' src='";
	    playListEntry[j++] = entry.media$group.media$thumbnail[0].url;
	    playListEntry[j++] = "'/><span class='title2'>";
	    playListEntry[j++] = entry.title.$t.replace('\'','');
	    playListEntry[j++] = "</span> </a> </li>";
	    youTubePlaylist.append(playListEntry.join(''));
	}

    //set the next and previous page values
    var back;
    if(page > 1)
        back = page - 1;
    var forward;
    if(entries.length > maxResults)
        forward = page + 1;

    //create back and forward links
    pagnateResults($('#youTubeSearchResults .pagnation'), "searchYouTube", term, forward, back);
	
    //call init on page player to initilize the playable items
	pagePlayer.init();
}

function displayMixtreeSearchResults(json)
{
	var mixtreePlaylist = $('#mixtreeSearchResults').children("ul");
	mixtreePlaylist.empty();

	for(var i=0 ; i < json.audio.length && i < maxResults ; i++)
	{
        var audio = json.audio[i]
	    var playListEntry = [];
	    var j = 0;
	    var id = audio.id;
	    var artist = audio.artist.replace('\'','');
	    var track = audio.track.replace('\'','');
	    playListEntry[j++] = "<li class='playlistEntry'> <div class='playListControls'>";
	    playListEntry[j++] = "<a href='#' title='add to mix list' class='playListControl' onclick='";
	    playListEntry[j++] = "javascript:addToMixList(\"";
	    playListEntry[j++] = id;
	    playListEntry[j++] = "\", \"";
	    playListEntry[j++] = artist;
	    playListEntry[j++] = "\",  \"";
	    playListEntry[j++] = track;		
	    playListEntry[j++] = "\", 0)'>+</a>";
	    playListEntry[j++] = "</div>";
	    playListEntry[j++] = "<a id='";
	    playListEntry[j++] = id;
	    playListEntry[j++] = "' href='#' class='playable' title='play track'>";
	    playListEntry[j++] = "<span class='title1'>";
	    playListEntry[j++] = artist;
	    playListEntry[j++] = "</span> <span class='title2'>";
	    playListEntry[j++] = track;
	    playListEntry[j++] = "</span> </a> </li>";
	    mixtreePlaylist.append(playListEntry.join(''));
	}

    //create back and forward links
    pagnateResults($('#mixtreeSearchResults .pagnation'), "searchMixtree", json.pagnation.searchCriteria, json.pagnation.forward, json.pagnation.back);

	//call init on page player to initilize the playable items
	pagePlayer.init();
}

//creates the nvigation for the pagnated results
function pagnateResults(div, searchFunction, searchTerm, forward, back)
{
    div.empty();
    var linkRoot = "<a href='#' class='pagnation_ctrl' onclick='javascript:" + searchFunction + "(\"" + searchTerm + "\", ";
    //add pagnation links if appliciable
    if(back != undefined)
       div.append(linkRoot + back + ")'> <= </a>"); 
    if(forward)
       div.append(linkRoot + forward + ")'> => </a>"); 
}

function refreshUserPanel()
{   
    $.get("{{= URL(r=request, c='user_panel', f='index')}}", 
        function(data)
        {
                $('#user_panel').replaceWith(data);
        }
    );   
}
