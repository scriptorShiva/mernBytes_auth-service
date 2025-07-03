import express, { NextFunction, Response } from 'express';
import { TenantController } from '../controllers/TenantController';
import { CreateTenantRequest } from '../types';
import { AppDataSource } from '../config/data-source';
import { Tenant } from '../entity/Tenant';
import { TenantService } from '../services/TenantService';
import logger from '../config/logger';
import authenticate from '../middlewares/authenticate';
import { canAccess } from '../middlewares/canAccess';
import { Roles } from '../constants';
import listUsersValidator from '../validators/list-users-validator';
import tenantValidator from '../validators/tenant-validator';

const router = express.Router();

//dependency injection ----
const tenantRepository = AppDataSource.getRepository(Tenant);
const tenantService = new TenantService(tenantRepository);
// create instance of class
const tenantController = new TenantController(tenantService, logger);

//after adding "authenticate" this route only accessible when there it verifies valid token in cookie.
router.post(
    '/',
    authenticate,
    tenantValidator,
    canAccess([Roles.ADMIN]),
    (req: CreateTenantRequest, res: Response, next: NextFunction) =>
        tenantController.create(req, res, next),
);

router.patch(
    '/:id',
    authenticate,
    tenantValidator,
    canAccess([Roles.ADMIN]),
    (req: CreateTenantRequest, res: Response, next: NextFunction) =>
        tenantController.update(req, res, next),
);

router.get(
    '/',
    listUsersValidator,
    (req: CreateTenantRequest, res: Response, next: NextFunction) =>
        tenantController.getAll(req, res, next),
);

router.get(
    '/:id',
    authenticate,
    canAccess([Roles.ADMIN]),
    (req: CreateTenantRequest, res: Response, next: NextFunction) =>
        tenantController.getOne(req, res, next),
);

router.delete(
    '/:id',
    authenticate,
    canAccess([Roles.ADMIN]),
    (req: CreateTenantRequest, res: Response, next: NextFunction) =>
        tenantController.destroy(req, res, next),
);

export default router;
