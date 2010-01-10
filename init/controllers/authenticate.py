from gluon.storage import Storage
exec('from applications.%s.modules import gfc_auth' %request.application)
reload(gfc_auth);

#check if the current user is logged in
def index():

    if not session.logged_in:
        session.user = gfc_auth.GFCUser.authenticate(mixtree_conf, request)
        if session.user:
            #create an auth session entry so that we can use the
            #SimpleAuth.isLoggedIn method and other decorators
            #based on gluon.Auth
            session.logged_in = True
    
    return dict()

