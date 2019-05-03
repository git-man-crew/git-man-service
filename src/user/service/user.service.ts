import {
    Injectable,
    BadRequestException,
    ForbiddenException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from '../model/user.model';
import { UserRepository } from '../repository/user.repository';

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
            throw new BadRequestException();
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

    public async validateUser(payload: any): Promise<any> {
        await this.userRepository.validateToken(payload.accessToken).catch(() => {
            throw new UnauthorizedException();
        });
        return payload;
    }
}
