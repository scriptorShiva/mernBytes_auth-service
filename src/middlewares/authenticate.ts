import { GetVerificationKey, expressjwt } from 'express-jwt';
import JwksClient from 'jwks-rsa';
import { Config } from '../config';
import { Request } from 'express';
import { AuthCookie } from '../types';

// this library will return middleware which we can direclty plug into our project.
export default expressjwt({
    secret: JwksClient.expressJwtSecret({
        // host url of private jwt key
        jwksUri: Config.JWKS_URI!,
        // not everytime it send request it cache it for use
        cache: true,
        // rateLimit : we have to make sure not so many key requests for same key to get
        rateLimit: true,
    }) as GetVerificationKey,
    algorithms: ['RS256'],
    getToken(req: Request) {
        // this library by default take token from authorization header BEARER but in our case we took it from cookie.
        // we'll be check in both : token in header looks like --> BEARER eglwoxlas
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.split(' ')[1] !== 'undefined') {
            const token = authHeader.split(' ')[1];
            if (token) {
                return token;
            }
        }

        // check in cookie if its not present in headers
        const { accessToken } = req.cookies as AuthCookie;
        return accessToken;
    },
});
