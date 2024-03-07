import express, { NextFunction, Response } from 'express';
import { TenantController } from '../controllers/TenantController';
import { CreateTenantRequest } from '../types';
import { AppDataSource } from '../config/data-source';
import { Tenant } from '../entity/Tenant';
import { TenantService } from '../services/TenantService';
import logger from '../config/logger';
import authenticate from '../middlewares/authenticate';

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
    (req: CreateTenantRequest, res: Response, next: NextFunction) =>
        tenantController.create(req, res, next),
);

export default router;
