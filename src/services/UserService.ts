import { Brackets, Repository } from 'typeorm';
import { User } from '../entity/User';
import { LimitedUserData, UserData, UserQueryParams } from '../types';
import createHttpError from 'http-errors';
import bycrpt from 'bcryptjs';

export class UserService {
    constructor(private userRepository: Repository<User>) {}
    async create({
        firstName,
        lastName,
        email,
        password,
        role,
        tenantId,
    }: UserData) {
        // for getRepository its again coupling the components we've to use depnendency injection again.
        // const userRepository = AppDataSource.getRepository(User);
        const user = await this.userRepository.findOne({
            where: { email: email },
        });
        if (user) {
            const error = createHttpError(400, 'Email is already exist!');
            throw error;
        }
        // hash the password
        const saltRounds = 10;
        const hashedPassword = await bycrpt.hash(password, saltRounds);
        try {
            return await this.userRepository.save({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role,
                tenant: tenantId ? { id: tenantId } : undefined,
            });
        } catch (err) {
            const error = createHttpError(
                500,
                'failed to store data in database',
            );
            throw error;
        }
    }

    async findByEmailWithPassword(email: string) {
        return await this.userRepository.findOne({
            where: {
                email,
            },
            select: [
                'id',
                'firstName',
                'lastName',
                'email',
                'role',
                'password',
            ],
        });
    }

    async findById(id: number) {
        return await this.userRepository.findOne({
            where: {
                id,
            },
            relations: {
                tenant: true,
            },
        });
    }

    async update(
        userId: number,
        { firstName, lastName, role, email, tenantId }: LimitedUserData,
    ) {
        try {
            return await this.userRepository.update(userId, {
                firstName,
                lastName,
                role,
                email,
                tenant: tenantId ? { id: tenantId } : undefined,
            });
        } catch (err) {
            const error = createHttpError(
                500,
                'Failed to update the user in the database',
            );
            throw error;
        }
    }

    async getAll(validatedQuery: UserQueryParams) {
        const queryBuilder = this.userRepository.createQueryBuilder('user');

        if (validatedQuery.q) {
            const searchTerm = `%${validatedQuery.q}%`;
            queryBuilder.where(
                new Brackets((qb) => {
                    qb.where(
                        "CONCAT(user.firstName, ' ', user.lastName) ILike :q",
                        { q: searchTerm },
                    ).orWhere('user.email ILike :q', { q: searchTerm });
                }),
            );
        }

        if (validatedQuery.role) {
            // andWhere for both will run role with search q
            queryBuilder.andWhere('user.role = :role', {
                role: validatedQuery.role,
            });
        }

        const result = await queryBuilder
            .leftJoinAndSelect('user.tenant', 'tenant')
            .skip((validatedQuery.currentPage - 1) * validatedQuery.perPage)
            .take(validatedQuery.perPage)
            .orderBy('user.id', 'DESC')
            .getManyAndCount();
        return result;
    }

    async deleteById(userId: number) {
        return await this.userRepository.delete(userId);
    }
}
