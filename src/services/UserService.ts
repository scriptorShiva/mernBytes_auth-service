import { Repository } from 'typeorm';
import { User } from '../entity/User';
import { UserData } from '../types';

export class UserService {
    constructor(private userRepository: Repository<User>) {}
    async create({ firstName, lastName, email, password }: UserData) {
        // for getRepository its again coupling we've to use depnendency injection again.
        // const userRepository = AppDataSource.getRepository(User);
        await this.userRepository.save({
            firstName,
            lastName,
            email,
            password,
        });
    }
}
