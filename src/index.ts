import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import passport from 'passport';
import { BearerStrategy } from 'passport-azure-ad';

import logger from './middlewares/logger';

import type { IUser } from './types';

dotenv.config();
const port = process.env.SERVER_PORT;
const app = express();

const options = {
	identityMetadata: process.env.IDENTITY_METADATA!,
	clientID: process.env.CLIENT_ID!,
	issuer: [process.env.MS_ISSUER!, process.env.TENANT_ISSUER!],
	loggingNoPII: false
};

passport.use(new BearerStrategy(options,
	(token, done) => {
		return done(null, token, token)
	}
));

app.use(logger);
app.use(cors());

app.get(
	'/',
	passport.authenticate(
		'oauth-bearer',
		{ session: false }
	),
	function(req, res) {
		const user = req.user as IUser;
		res.type('txt');
		res.send(`Hello ${user.name}!`);
	}
);

app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});