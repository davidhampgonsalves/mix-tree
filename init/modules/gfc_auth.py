#!/usr/bin/env python 
# coding: utf8 
from gluon.html import *
from gluon.http import *
from gluon.validators import *
from gluon.sqlhtml import *
# request, response, session, cache, T, db(s) 
# must be passed and cannot be imported!

import opensocial
from opensocial.errors import *
#exec('from applications.%s.modules.opensocial import *' %request.application)

class GFCUser:

    @staticmethod
    def authenticate(mixtree_conf, request):
        #check for the gfc cookie
        if request.cookies.has_key(mixtree_conf.gfc_cookie_name):
            cookie = request.cookies[mixtree_conf.gfc_cookie_name]
            
	    if cookie :
	        #authenticate user and populate the related user fields
        	gfcUser = GFCUser(cookie.value)
            
            	#if the gfcUser is logged 
            	if gfcUser.is_logged_in():
                    return gfcUser
                
        #returns None or a GFCUserObject            
        return None
        
    def __init__(self, fcauth):
        #config = opensocial.ContainerConfig(oauth_consumer_key='*:16790195981542317008', oauth_consumer_secret='2GpAILSlOWY=', server_rpc_base='http://friendconnect.gmodules.com/ps/api/rpc', server_rest_base='http://friendconnect.gmodules.com/ps/api')
        config = opensocial.ContainerConfig(
            security_token = fcauth,
            security_token_param = 'fcauth',
            server_rpc_base = 'http://friendconnect.gmodules.com/ps/api/rpc',
            #server_rest_base = 'http://friendconnect.gmodules.com/ps/api'
	    )
            
        self.osContainer = opensocial.ContainerContext(config)
        self.logged_in = False
	self.name = ""
	self.id = ""
        
        self.populate_data()
        

    def populate_data(self):
        person_request = opensocial.FetchPersonRequest(user_id='@me', fields=['@all'])
        
	response = None
        try:
            response = self.osContainer.send_request(person_request)
        except UnauthorizedRequestError:
            # bad cookie fcauth value
            self.logged_in = False            
            
        if response:
            self.id = response.get_id()
	    self.name = response.get_display_name()
	    self.thumbnail = response['thumbnailUrl']
            self.logged_in = True
             
                    
    def is_logged_in(self):
        return self.logged_in

    def get_name(self):
	return self.name

    def get_id(self):
	return self.id

    def get_thumbnail(self):
	return self.thumbnail

    @staticmethod
    def get_invite_code():
	return 'google.friendconnect.requestInvite();'

    @staticmethod
    def get_logout_code():
        return 'google.friendconnect.requestSignOut();'
        
