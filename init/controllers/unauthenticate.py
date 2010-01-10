from gluon.storage import Storage
exec('from applications.%s.modules import gfc_auth' %request.application)
reload(gfc_auth);

#log the current user out
def index():

    if session.logged_in:
        session.user = None
        session.logged_in = False
    
    return dict()

