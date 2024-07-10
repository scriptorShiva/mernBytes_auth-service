import bcrypt from 'bcryptjs';

export class CredentialService {
    async comparePassword(userPassword: string, passwordHash: string) {
        const isPasswordVerified = await bcrypt.compare(
            userPassword,
            passwordHash,
        );
        return isPasswordVerified;
    }
}
