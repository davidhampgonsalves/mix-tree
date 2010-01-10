import gluon.contrib.simplejson as sj

results_per_page = 10

def search():
    '''returns the results in json to an audio search'''
    page = 0
    json_response = {}
    search_criteria = None
    
    if len(request.args) > 0:
        search_criteria = request.args[0]
        if len(request.args) == 2:
            page = int(request.args[1])

    #get approperate records
    if search_criteria:
        #this is a gae hack because there isn't any full text string search
        if request.env.web2py_runtime_gae:        
            audio_by_artist = db.Audio.artist == search_criteria
            #audio = db.executesql('SELECT * FROM Audio WHERE prop >= ' +  search_criteria + ' AND prop < ' + (unicode(search_criteria) + u"\ufffd"))
        else:
            audio_by_artist = db.Audio.artist.like('%'+search_criteria+'%')
            
        audio = db(audio_by_artist).select(limitby=(page*results_per_page, (page+1) * (results_per_page+1)))    
        json_audio = []
        audio_result_len = len(audio)
        #create a json representation of the audio results
        for i in range(0, audio_result_len):
            a = audio[i]
            json_audio.append( {'id':a.id, 'artist':a.artist, 'track':a.track})

        #create flags to determine if the forward and back links are applicable
        if audio_result_len <= results_per_page:
            forward = None;
        else:
            forward = page + 1
        if page == 0:
            back = None
        else:
            back = page - 1

        json_response['audio'] = json_audio
        json_response['pagnation'] = {'searchCriteria':search_criteria, 'forward':forward, 'back':back}

    return sj.dumps(json_response)
