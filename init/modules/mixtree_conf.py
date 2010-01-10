#!/usr/bin/env python 
# coding: utf8 

# define an object to hold constants
class MixtreeConf(object):
    gfc_id = None
    gfc_cookie_name = None
    
    def __init__(self, request):
        if request.env.web2py_runtime_gae:
            self.gfc_id = '06147866215331476977' #prod
        else:
            self.gfc_id = '16790195981542317008' #dev
            
        self.gfc_cookie_name = 'fcauth' + self.gfc_id
