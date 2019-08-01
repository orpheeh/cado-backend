
exports.verifyAccess = function verifyAccess(req, res, next) {
	const access_name = req.headers['authorization'].split('Access ')[1].split('Bearer ')[0];
	const method = req.method;
	const route = req.path;
	const rule = { method, route }
	if (access[access_name] === '*') {
		return next();
	}
	let ok = false;
	access[access_name].forEach(element => {
		if (element.method === rule.method) {
			let route_e = element.route;
			let route_r = rule.route;
			if (route_e.split('/')[route_e.split('/').length - 1] === ':id') {
				route_e = route_e.replace(':id', route_r.split('/')[route_e.split('/').length - 1]);
			}
			if (route_e == route_r)
				ok = true;
		}
	});

	if (ok) {
		next();
	} else {
		res.sendStatus(401);
	}
}