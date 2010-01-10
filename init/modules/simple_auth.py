#!/usr/bin/env python 
# coding: utf8 
from gluon.html import *
from gluon.http import *
from gluon.validators import *
from gluon.sqlhtml import *

class Auth:
    @staticmethod
    def isLoggedIn(session):
        if session.logged_in:
            if session.user and session.user.is_logged_in():
                return True
        else:
            return False

    @staticmethod
    def get_user(session):
        return session.user

