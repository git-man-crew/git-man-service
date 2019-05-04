import {
    Injectable,
    BadRequestException,
    ForbiddenException,
    UnauthorizedException,
    Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from '../models/user.model';
import { UserRepository } from '../repository/user.repository';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';

@Injectable()
export class UserService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userRepository: UserRepository,
    ) { }

    public async registerUser(userModel: UserModel) {
        if (
            !userModel.birthDate ||
            !userModel.email ||
            !userModel.name ||
            !userModel.password ||
            !userModel.phoneNumber
        ) {
            throw new BadRequestException('Missing user data for registration');
        }
        return this.userRepository.signUpUser(userModel);
    }

    public async createToken(authModel: UserModel) {
        if (!authModel.email || !authModel.password) {
            throw new BadRequestException();
        }
        const user = await this.userRepository.signInUser(authModel).catch(() => {
            throw new ForbiddenException();
        });
        const accessToken = this.jwtService.sign({
            user: authModel.email,
            accessToken: user.getAccessToken().getJwtToken(),
            idToken: user.getIdToken().getJwtToken(),
            refreshToken: user.getRefreshToken().getToken(),
        });
        return {
            expiresIn: 3600,
            accessToken,
        };
    }

    public async updateUser(userModel: UserModel) {
        return await this.userRepository.updateUser(userModel).catch((err) => {
            throw new BadRequestException(err.message);
        });
    }

    public async deleteUser(userModel: UserModel) {
        return await this.userRepository.deleteUser(userModel).catch((err) => {
            throw new BadRequestException(err.message);
        });
    }

    public async changePassword(userModel: UserModel) {
        return await this.userRepository.changePassword(userModel).catch((err) => {
            throw new BadRequestException(err.message);
        });
    }

    public async validateUser(payload: any): Promise<any> {
        await this.userRepository.validateToken(payload.accessToken).catch(() => {
            throw new UnauthorizedException();
        });
        return payload;
    }
}
