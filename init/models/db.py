# coding: utf8

#########################################################################
## This scaffolding model makes your app work on Google App Engine too
#########################################################################

if request.env.web2py_runtime_gae: # if running on Google App Engine
    from gluon.contrib.gql import *  
    ### connect to Google BigTable
    db = GQLDB()
    ## and store sessions and tickets there
    session.connect(request, response, db=db)
    ### or use the following lines to store sessions in Memcache
    # from gluon.contrib.memdb import MEMDB
    # from google.appengine.api.memcache import Client
    # session.connect(request, response, db=MEMDB(Client()))
else: # else use a normal relational database
    # if not, use SQLite or other DB
    #db = SQLDB('sqlite://storage.sqlite')
    db = SQLDB('mysql://mixtree:conflic1@192.168.1.101/mixtree')

#########################################################################
## uncomment the following line if you do not want sessions
#session.forget()
#########################################################################

#########################################################################
#define the audio table
db.define_table('Audio',
    db.Field('artist', 'string'),
    db.Field('track', 'string'),
    #db.Field('search_field', 'string'),
    db.Field('file_count', 'integer', default=1),
    #db.Field('del', 'boolean'),
    migrate=False)
#define lenghts
db.Audio.artist.length = 100
db.Audio.track.length = 100
#db.audio.search_field.length = 200

#define form attributes
db.Audio.file_count.represent=False
#define requirements
db.Audio.artist.requires = IS_NOT_EMPTY()
db.Audio.track.requires = IS_NOT_EMPTY()

#define the audio_links table
db.define_table('AudioLinks',
    db.Field('audio_id', 'integer'),
    db.Field('domain', 'string'),
    db.Field('url', 'string'),
    #db.Field('del', 'boolean'),
    migrate = False)
#define lengths
db.AudioLinks.audio_id.length = 10
db.AudioLinks.url.length = 800
#define requirements
db.AudioLinks.requires = IS_NOT_EMPTY()

#########################################################################

#########################################################################
## Here is sample code if you need:
## - email capabilities
## - authentication (registration, login, logout, ... )
## - authorization (role based authorization)
## - services (xml, csv, json, xmlrpc, jsonrpc, amf, rss)
## - crud actions
## comment/uncomment as needed
#########################################################################

exec('from applications.%s.modules.simple_auth import Auth as auth' %request.application)
exec('from applications.%s.modules.mixtree_conf import *' %request.application)
mixtree_conf = MixtreeConf(request)

#from gluon.tools import *
#auth=Auth(globals(),db)            # authentication/authorization
#auth.define_tables()               # creates all needed tables
#crud=Crud(globals(),db)            # for CRUD helpers using auth
#service=Service(globals())         # for json, xml, jsonrpc, xmlrpc, amfrpc

## uncomment as necessary or consult docs for more options
#crud.settings.auth=auth           # (optional) enforces authorization on crud
#mail=Mail()                                  # mailer
#mail.settings.server='smtp.gmail.com:587'    # your SMTP server
#mail.settings.sender='you@gmail.com'         # your email
#mail.settings.login='username:password'      # your credentials
#auth.settings.mailer=mail         # for user email verification
#auth.settings.registration_requires_verification = True
#auth.settings.registration_requires_approval = True
#auth.messages.verify_email = \
#  'Click on the link http://.../verify_email/%(key)s to verify your email'
