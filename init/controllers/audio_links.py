import gluon.contrib.simplejson as sj

def urls_by_id():
    # get the audio id from the request
    id = request.args[0]

    # get the audio_links which hold the urls
   # audioLinksByAudioId = db.audio_links.audio_id == id;
    audio_links = db(db.AudioLinks.audio_id == id).select(limitby=(0,1))
    urls = []

    for audio_link in audio_links:
        urls.append(audio_link.url)

    return sj.dumps(urls)
