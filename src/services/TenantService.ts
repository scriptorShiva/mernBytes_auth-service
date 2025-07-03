import { Repository } from 'typeorm';
import { Tenant } from '../entity/Tenant';
import { ITenant } from '../types';

export class TenantService {
    constructor(private tenantRepository: Repository<Tenant>) {}

    async create(tenantData: ITenant) {
        return await this.tenantRepository.save(tenantData);
    }

    async update(id: number, tenantData: ITenant) {
        return await this.tenantRepository.update(id, tenantData);
    }

    async getAll(validatedQuery: any) {
        const result = await this.tenantRepository.findAndCount({
            skip: (validatedQuery.currentPage - 1) * validatedQuery.perPage,
            take: validatedQuery.perPage,
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
