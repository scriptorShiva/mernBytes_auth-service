import { ILike, Repository } from 'typeorm';
import { Tenant } from '../entity/Tenant';
import { ITenant, TenantQueryParams } from '../types';

export class TenantService {
    constructor(private tenantRepository: Repository<Tenant>) {}

    async create(tenantData: ITenant) {
        return await this.tenantRepository.save(tenantData);
    }

    async update(id: number, tenantData: ITenant) {
        return await this.tenantRepository.update(id, tenantData);
    }

    async getAll(validatedQuery: TenantQueryParams) {
        if (!validatedQuery.q) {
            validatedQuery.q = '';
        }
        // add pagination and search on name
        const result = await this.tenantRepository.findAndCount({
            where: {
                name: ILike(`%${validatedQuery.q}%`),
            },
            skip: (validatedQuery.currentPage - 1) * validatedQuery.perPage,
            take: validatedQuery.perPage,
            order: {
                createdAt: 'DESC',
            },
        });
        return result;
    }

    async findById(id: number) {
        return await this.tenantRepository.findOne({
            where: {
                id,
            },
        });
    }

    async deleteById(id: number) {
        return await this.tenantRepository.delete(id);
    }
}
