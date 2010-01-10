# coding: utf8
# try something like
def index():
	#create search form
	formSearch = FORM(INPUT(_id='searchInput', requires=[IS_NOT_EMPTY(error_message='you have to enter something to search for'),
			IS_LENGTH(50, error_message='you can\'t have such a long search term, limit is 50 characters')]),
			INPUT(_type='submit', _id='searchButton'), _action='', _method='get')
	return dict(formSearch=formSearch)

