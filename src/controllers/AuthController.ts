import { NextFunction, Response } from 'express';
import { AuthRequest, RegisterUserRequest } from '../types';
import { UserService } from '../services/UserService';
import { Logger } from 'winston';
import { validationResult } from 'express-validator';
import { JwtPayload } from 'jsonwebtoken';
import { TokenService } from '../services/TokenService';
import createHttpError from 'http-errors';
import { CredentialService } from '../services/CredentialService';
import { Roles } from '../constants';

export class AuthController {
    // userService: UserService;
    // constructor(userService: UserService) {
    //     this.userService = userService;
    // }
    // shorcut to implement above -- (its a dependency injection)
    constructor(
        private userService: UserService,
        private logger: Logger,
        private tokenService: TokenService,
        private credentialService: CredentialService,
    ) {}

    async register(
        req: RegisterUserRequest,
        res: Response,
        next: NextFunction,
    ) {
        // validation
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { firstName, lastName, email, password } = req.body;
        this.logger.debug('New request to register a user', {
            firstName,
            lastName,
            email,
            password: '*******',
        });
        try {
            const user = await this.userService.create({
                firstName,
                lastName,
                email,
                password,
                role: Roles.CUSTOMER,
            });
            this.logger.info('user has been registered', { id: user.id });

            // add jwt in cookies before sending response
            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            };

            const accessToken = this.tokenService.generateAccessToken(payload);

            res.cookie('accessToken', accessToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60, // 1hr
                // very important
                httpOnly: true,
            });

            //Persist the refresh token in database
            const newRefreshToken =
                await this.tokenService.persistRefreshToken(user);

            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken.id),
            });

            res.cookie('refreshToken', refreshToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
                httpOnly: true,
            });

            res.status(201).json({ id: user.id });
        } catch (err) {
            next(err);
            return;
        }
    }

    async login(req: RegisterUserRequest, res: Response, next: NextFunction) {
        // validation
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { email, password } = req.body;
        this.logger.debug('New request to login a user', {
            email,
            password: '*******',
        });

        /* 
            check email exist in database 
            compare password
            Generate token
            Add tokens to cookies
            retun the response (id)
        */
        try {
            const user = await this.userService.findByEmailWithPassword(email);

            if (!user) {
                const error = createHttpError(
                    400,
                    'Email and Password does not match',
                );
                next(error);
                // stop the function
                return;
            }

            const isPasswordMatch =
                await this.credentialService.comparePassword(
                    password,
                    user.password,
                );

            if (!isPasswordMatch) {
                const error = createHttpError(
                    400,
                    'Email and Password does not match',
                );
                next(error);
                // stop the function
                return;
            }

            // add jwt in cookies before sending response
            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
                tenant: user.tenant ? String(user.tenant.id) : '',
            };

            const accessToken = this.tokenService.generateAccessToken(payload);

            res.cookie('accessToken', accessToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60, // 1hr
                // very important
                httpOnly: true,
            });

            //Persist the refresh token in database
            // first we generate token with id in database
            const newRefreshToken =
                await this.tokenService.persistRefreshToken(user);

            // then , embedd that token id into the token RT.
            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken.id),
            });

            res.cookie('refreshToken', refreshToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
                httpOnly: true,
            });

            this.logger.info('User has been logged in ', { id: user.id });

            res.status(200).json({ id: user.id });
        } catch (err) {
            next(err);
            return;
        }
    }

    async self(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            // token req.auth.id : first get userId from token then get data by id from db.
            const user = await this.userService.findById(Number(req.auth.sub));
            res.json({ ...user, password: undefined });
        } catch (error) {
            next(error);
            return;
        }
    }

    async refresh(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            // if we successfully reached here : then our refresh token is verified successfully by middleware.
            // create a new access token
            const payload: JwtPayload = {
                sub: req.auth.sub,
                role: req.auth.role,
                tenant: req.auth.tenant ? String(req.auth.tenant) : '',
            };
            // generate access token
            const accessToken = this.tokenService.generateAccessToken(payload);

            res.cookie('accessToken', accessToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60, // 1hr
                // very important
                httpOnly: true,
            });

            // get user from database
            const user = await this.userService.findById(Number(req.auth.sub));
            if (!user) {
                const error = createHttpError(
                    400,
                    'User with token could not find',
                );
                next(error);
                return;
            }

            //Persist the refresh token in database : REFRESH TOKEN ROTATION : generate new RT and added into the database.
            // first we generate token with id in database
            const newRefreshToken =
                await this.tokenService.persistRefreshToken(user);

            // delete old refresh token
            await this.tokenService.deleteRefreshToken(Number(req.auth.id));

            // then , embedd that token id into the token RT.
            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken.id),
            });

            res.cookie('refreshToken', refreshToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
                httpOnly: true,
            });
            this.logger.info('User has been logged in ', { id: user.id });

            res.status(200).json({ id: user.id });
        } catch (error) {
            next(error);
            return;
        }
    }

    async logout(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            // delete old refresh token
            await this.tokenService.deleteRefreshToken(Number(req.auth.id));
            this.logger.info('User has been loggedout', { id: req.auth.sub });

            // clear cookies
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');

            // by default it take 200 status code
            res.json({});
        } catch (error) {
            next(error);
            return;
        }
    }
}
