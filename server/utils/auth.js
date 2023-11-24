// imports json web token module
const jwt = require('jsonwebtoken');
const { GraphQLError } = require('graphql'); //add graphQL to the file to make queries.
// sets token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
	AuthenticationError: new GraphQLError('Could not authenticate user.', {
		extensions: {
			code: 'UNAUTHENTICATED',
		},
	}),
	authMiddleware: function ({ req }) { //creates the middleware that allows the token to be sent.
		let token =
			req.body.token || req.query.token || req.headers.authorization;

		if (req.headers.authorization) {
			token = token.split(' ').pop().trim();
		}

		if (!token) {
			return req; //if we don't have a token just return the request.
		}

		try { //verify the token and get the data from it.
			const { data } = jwt.verify(token, secret, { maxAge: expiration });
			req.user = data;
		} catch {
			console.log('Invalid token'); //if we don't have a valid token, say so
		}

		return req;
	},
	signToken: function ({ email, username, _id }) { //sign the toekn with the user's info.
		const payload = { email, username, _id };
		return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
	},
};