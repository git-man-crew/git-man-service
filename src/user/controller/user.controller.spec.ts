import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserModule } from '../user.module';
import { UserService } from '../service/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../repository/user.repository';
import { mock } from 'ts-mockito';
import { UserModel } from '../models/user.model';

describe('Auth Controller', () => {
  let controller: UserController;
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();
    controller = module.get<UserController>(UserController);

    const jwtService: JwtService = mock(JwtService);
    const userRepository: UserRepository = mock(UserRepository);
    userService = new UserService(jwtService, userRepository);
    userController = new UserController(userService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register a new user with POST', async () => {
    const userModel: UserModel = {
      email: 'leon.jaekel@sparqs.io',
    };
    jest.spyOn(userService, 'registerUser').mockReturnValue(Promise.resolve(true));
    const result = await userController.registerUser(userModel);
    expect(result).toBeTruthy();
  });
});
