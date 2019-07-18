
const access = {
    'browser' : '*',
    'mobile' :  [{ method: 'GET', route: '/api/project/:id',},
				 { method: 'POST', route: '/api/mobile/auth'},
			     { method: 'POST', route: '/api/mobile/marker'}]
}

module.exports = access;