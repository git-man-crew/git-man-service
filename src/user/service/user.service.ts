import {
    Injectable,
    BadRequestException,
    ForbiddenException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from '../models/user.model';
import { UserRepository } from '../repository/user.repository';
import { CryptoService } from '../../crypto/service/crypto.service';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import camelcase = require('camelcase');

@Injectable()
export class UserService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userRepository: UserRepository,
        private readonly cryptoService: CryptoService,
    ) { }

    public async registerUser(userModel: UserModel) {
        if (
            !userModel.birthdate ||
            !userModel.email ||
            !userModel.name ||
            !userModel.password ||
            !userModel.phoneNumber
        ) {
            throw new BadRequestException('Missing user data for registration');
        }
        return await this.userRepository.signUpUser(userModel).catch((err) => {
            throw new BadRequestException(err.message);
        });
    }

    public async createToken(authModel: UserModel) {
        if (!authModel.email || !authModel.password) {
            throw new BadRequestException();
        }
        const user = await this.userRepository.signInUser(authModel).catch(() => {
            throw new ForbiddenException();
        });
        const accessToken = this.jwtService.sign({
            userDetails: this.cryptoService.encryptText(JSON.stringify(authModel)),
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

    public async getUser(userModel: UserModel): Promise<UserModel> {
        const userAttributes: CognitoUserAttribute[] = await this.userRepository.getUserAttributes(userModel).catch((err) => {
            throw new BadRequestException(err.message);
        });
        const user: UserModel = {
            email: userModel.email,
        };
        userAttributes.forEach((attribute: CognitoUserAttribute) => {
            user[camelcase(attribute.getName())] = attribute.getValue();
        });
        return user;
    }
}
