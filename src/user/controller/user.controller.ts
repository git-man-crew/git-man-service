import {
  Controller,
  Get,
  UseGuards,
  Post,
  Body,
  Response,
  Request,
  Put,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../service/user.service';
import { UserModel } from '../model/user.model';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }

  @Put()
  async registerUser(@Body() userModel: UserModel) {
    return await this.userService.registerUser(userModel).catch(() => {
      throw new BadRequestException();
    });
  }

  @Post()
  async createToken(
    @Body() userModel: UserModel,
    @Response() response,
  ): Promise<any> {
    const token = await this.userService.createToken(userModel);
    response.set('Authorization', `Bearer ${token.accessToken}`);
    response.send(token);
  }

  @Get()
  @UseGuards(AuthGuard())
  findAll(@Request() request) {
    return request.user;
  }
}
