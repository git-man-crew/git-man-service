import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserModule } from '../user.module';
import { UserService } from '../service/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../repository/user.repository';
import { mock } from 'ts-mockito';
import { UserModel } from '../models/user.model';
import { CryptoService } from '../../crypto/service/crypto.service';
import * as LoginResposne from '../../../resources/mocks/loginResponse.json';
import Substitute from '@fluffy-spoon/substitute';
import { Response as ExpressResponse } from 'express';

describe('Auth Controller', () => {
  let controller: UserController;
  let userController: UserController;
  let userServiceMock: UserService;
  let userService: UserService;
  let cryptoService: CryptoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();
    controller = module.get<UserController>(UserController);
    cryptoService = module.get<CryptoService>(CryptoService);
    userService = module.get<UserService>(UserService);

    const cryptoServiceMock: CryptoService = mock(CryptoService);
    const jwtService: JwtService = mock(JwtService);
    const userRepository: UserRepository = mock(UserRepository);
    userServiceMock = new UserService(jwtService, userRepository, cryptoServiceMock);
    userController = new UserController(userServiceMock, cryptoServiceMock);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register a new user with POST', async () => {
    const userModel: UserModel = {
      email: 'leon.jaekel@sparqs.io',
    };
    jest.spyOn(userServiceMock, 'registerUser').mockReturnValue(Promise.resolve(true));
    const result = await userController.registerUser(userModel);
    expect(result).toBeTruthy();
  });

  it('should get user details and attributes with GET', async () => {
    const userDetails: string = JSON.stringify({
      email: 'leon.jaekel@sparqs.io',
      password: 'topSecret',
    });
    const user = {
      userDetails: cryptoService.encryptText(userDetails),
    };
    const expectedUserData: UserModel = {
      email: 'leon1jaekel@aol.com',
      sub: 'eae6c741-f78d-4957-82ab-e4e2a9294ea5',
      birthdate: '13.12.1990',
      emailVerified: 'true',
      name: 'Maxi',
      phoneNumberVerified: 'false',
      phoneNumber: '+491775558762',
      preferredUsername: 'leon1jaekel@aol.com',
    };

    jest.spyOn(userService, 'getUser').mockResolvedValue(Promise.resolve(expectedUserData));

    const result = await controller.getUser({ user });

    expect(result).toStrictEqual(expectedUserData);
  });

  it('should update user details and attributes with PUT', async () => {
    const userDetails: string = JSON.stringify({
      email: 'leon.jaekel@sparqs.io',
      password: 'topSecret',
    });
    const user = {
      userDetails: cryptoService.encryptText(userDetails),
    };
    const userModel = {
      email: 'leon1jaekel@aol.com',
      sub: 'eae6c741-f78d-4957-82ab-e4e2a9294ea5',
      birthdate: '13.12.1990',
      emailVerified: 'true',
      name: 'Leon Jäkel',
      phoneNumberVerified: 'false',
      phoneNumber: '+491775558762',
      preferredUsername: 'leon1jaekel@aol.com',
    };

    jest.spyOn(userService, 'updateUser').mockResolvedValue(Promise.resolve('SUCCESS'));

    const result = await controller.updateUser({ user }, userModel);

    expect(result).toStrictEqual('SUCCESS');
  });

  it('should delete an user with DELETE', async () => {
    const userDetails: string = JSON.stringify({
      email: 'leon.jaekel@sparqs.io',
      password: 'topSecret',
    });
    const user = {
      userDetails: cryptoService.encryptText(userDetails),
    };
    const userModel = {
      email: 'leon1jaekel@aol.com',
    };

    jest.spyOn(userService, 'deleteUser').mockResolvedValue(Promise.resolve('SUCCESS'));

    const result = await controller.deleteUser({ user }, userModel);

    expect(result).toStrictEqual('SUCCESS');
  });

  it('should create a JWT token by user authentication', async () => {
    const userModel = {
      email: 'leon1jaekel@aol.com',
      password: 'topSecretPassword',
    };
    const reponseMock = Substitute.for<ExpressResponse>();
    jest.spyOn(userService, 'createToken').mockResolvedValue(Promise.resolve(LoginResposne));

    const result = await controller.createToken(userModel, reponseMock);

    expect(userService.createToken).toBeCalledWith(userModel);
  });

  it('should change current passwort with valid JWT token', async () => {
    const userModel = {
      email: 'leon1jaekel@aol.com',
      password: 'topSecretPassword',
      newPassword: 'newSecretPassword',
    };
    jest.spyOn(userService, 'changePassword').mockResolvedValue(Promise.resolve('SUCCESS'));

    const result = await controller.changePassword(userModel);

    expect(userService.changePassword).toBeCalledWith(userModel);
  });

});
