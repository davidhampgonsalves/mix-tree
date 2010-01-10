	var trackCount = 0;	function addMedia(id, title1, title2, type) 
	{
		//add control to be able to remove this mix list entry
		var newEntry = "<li class='mixListEntry'><div class='playListControls'><a id='" + trackCount + "' class='playListControl exclude' href='javascript:removeMedia(\"" + trackCount + " \")'> - </a></div>";

		//depending on the type a different kind of link should be generated
		//type 0 is sound tree
		if(type == 0)
			newEntry += "<a href='#' class='playable' id=" + id + "> <span class='title1'> " + title1 + " </span> <span class='title2'> " + title2 + "</span> </a>";
		//type 1 is youtube
		else if(type == 1)
			newEntry += "<a href='#' class='playable youtube' id=" + id + "> <span class='title1'> " + title1 + " </span> </a>";
		newEntry += "</li>";
		
		var mixList = $(".playlist");
	
		var newMixListEntry = mixList.append(newEntry);

		//add the track to the pagePlayers queue
		pagePlayer.add(trackCount, document.getElementById(id));
		//increment trackCount
		trackCount++;
	}

	//removes a media entry from the mix list
	function removeMedia(id)
	{
		var control = $("#" + id);

		//remove the entry from the pagePlayer links
		pagePlayer.remove(control.parent().next().children('a').attr('rel'));

		//remove the assoicated li which contans the track listing and the control
		control.parent().parent().remove();

	}

	//makes the play list sortable
        $(document).ready(function() 
	{
		$(".playlist").sortable
		({
			placeholder: 'sortingPlaceHolder',

			update: function(event, ui) 
			{
				pagePlayer.rebuildPlaylist();
			}

		});
	});
