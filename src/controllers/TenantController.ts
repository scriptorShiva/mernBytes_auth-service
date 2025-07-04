import { NextFunction, Response } from 'express';
import { TenantService } from '../services/TenantService';
import { Logger } from 'winston';
import { CreateTenantRequest, TenantQueryParams } from '../types';
import { matchedData, validationResult } from 'express-validator';
import createHttpError from 'http-errors';

export class TenantController {
    constructor(
        private tenantService: TenantService,
        private logger: Logger,
    ) {}

    async create(req: CreateTenantRequest, res: Response, next: NextFunction) {
        // validation
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { name, address } = req.body;
        this.logger.debug('Request for creating a tenant', req.body);

        try {
            const tenant = await this.tenantService.create({ name, address });
            this.logger.info('Tenant has been created', { id: tenant.id });

            res.status(201).json({ id: tenant.id });
        } catch (err) {
            next(err);
        }
    }

    async update(req: CreateTenantRequest, res: Response, next: NextFunction) {
        // validation
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { name, address } = req.body;
        const tenantId = req.params.id;

        if (isNaN(Number(tenantId))) {
            next(createHttpError(400, 'Invalid url param.'));
            return;
        }

        this.logger.debug('Request for updating a tenant', req.body);

        try {
            await this.tenantService.update(Number(tenantId), {
                name,
                address,
            });
            this.logger.info('Tenant has been updated', { id: tenantId });
            res.json({ id: tenantId });
        } catch (err) {
            next(err);
        }
    }

    async getAll(req: CreateTenantRequest, res: Response, next: NextFunction) {
        // const validatedQueryRaw = matchedData(req, { onlyValidData: true });
        const validatedQueryRaw = matchedData(req, {
            onlyValidData: true,
        }) as Partial<TenantQueryParams>;

        // Ensure validatedQuery has the required properties and correct types
        const validatedQuery: TenantQueryParams = {
            q: validatedQueryRaw.q ?? '',
            perPage: Number(validatedQueryRaw.perPage) || 10,
            currentPage: Number(validatedQueryRaw.currentPage) || 1,
        };

        try {
            const [tenants, count] =
                await this.tenantService.getAll(validatedQuery);

            this.logger.info('All tenants have been fetched');
            res.json({
                currentPage: validatedQuery.currentPage,
                perPage: validatedQuery.perPage,
                total: count,
                data: tenants,
            });
        } catch (err) {
            next(err);
        }
    }

    async getOne(req: CreateTenantRequest, res: Response, next: NextFunction) {
        const tenantId = req.params.id;

        if (isNaN(Number(tenantId))) {
            next(createHttpError(400, 'Invalid url param.'));
            return;
        }

        try {
            const tenant = await this.tenantService.findById(Number(tenantId));

            if (!tenant) {
                next(createHttpError(400, 'Tenant does not exist.'));
                return;
            }

            this.logger.info('Tenant has been fetched', { id: tenantId });
            res.json(tenant);
        } catch (err) {
            next(err);
        }
    }

    async destroy(req: CreateTenantRequest, res: Response, next: NextFunction) {
        const tenantId = req.params.id;

        if (isNaN(Number(tenantId))) {
            next(createHttpError(400, 'Invalid url param.'));
            return;
        }

        try {
            await this.tenantService.deleteById(Number(tenantId));

            this.logger.info('Tenant has been deleted', {
                id: Number(tenantId),
            });
            res.json({ id: Number(tenantId) });
        } catch (err) {
            next(err);
        }
    }
}
