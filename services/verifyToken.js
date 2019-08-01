exports.verifyToken = function verifyToken(req, res, next) {

	const token = req.headers['authorization'].split('Bearer ')[1];
	if (token == null || token == '' || token === undefined) {
		res.sendStatus(401);
	}
	jwt.verify(token, 'private.key', function (err, decoded) {
		if (err) {
			return next(err);
		}
		next();
	});
}