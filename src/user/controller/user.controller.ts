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
  Headers,
  HttpCode,
  HttpStatus,
  Logger,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../service/user.service';
import { UserModel } from '../models/user.model';
import { ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PayloadModel } from '../models/payload.model';
import { AnyLengthString } from 'aws-sdk/clients/comprehend';

@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'User is successful created and activation mail is sent.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async registerUser(@Body() userModel: UserModel) {
    return await this.userService.registerUser(userModel).catch(err => {
      throw err;
    });
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'User JWT information should be displayed',
    type: PayloadModel,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AuthGuard())
  public getUserTokens(@Request() { user }): PayloadModel {
    return user as PayloadModel;
  }

  @Put()
  @ApiResponse({
    status: 200,
    description: 'User properties are successful updated',
    type: UserModel,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AuthGuard())
  public async  updateUser(@Body() userModel: UserModel): Promise<any> {
    return await this.userService.updateUser(userModel);
  }

  @Delete()
  @ApiResponse({
    status: 200,
    description: 'User is successful successfully deleted',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AuthGuard())
  public async deleteUser(@Body() userModel: UserModel) {
    return await this.userService.deleteUser(userModel);
  }

  @Post('auth')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'User is successful signed in and JWT is created.',
    type: UserModel,
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  public async createToken(
    @Body() userModel: UserModel,
    @Response() response,
  ): Promise<any> {
    const token = await this.userService.createToken(userModel);
    response.set('Authorization', `Bearer ${token.accessToken}`);
    response.send(token);
  }

  @Put('auth')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'User is successful signed in and JWT is created.',
    type: UserModel,
  })
  @ApiResponse({ status: 400, description: 'Forbidden' })
  public async changePassword(
    @Body() userModel: UserModel
  ): Promise<any> {
    return await this.userService.changePassword(userModel);
  }
}
