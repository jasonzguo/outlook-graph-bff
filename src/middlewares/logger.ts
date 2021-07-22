import type { NextFunction, Response, Request } from 'express';
import pino from 'pino';

const pl = pino({
	timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`
});

function logger(req: Request, res: Response, next: NextFunction) {
	try {
		const startTime = new Date().getTime();
		next();
		const endTime = new Date().getTime();

		pl.info({
			method: req.method,
			url: req.url,
			params: req.params,
			status: res.statusCode,
			duration: `${endTime - startTime}ms`
		});
	} catch(error) {
		pl.error({
			message: error.toString()
		})
	}
}

export default logger;
