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
import { CryptoService } from '../../crypto/service/crypto.service';
import { Response as ExpressResponse } from 'express';

@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly cryptoService: CryptoService) { }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'User is successful created and activation mail is sent.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async registerUser(@Body() userModel: UserModel) {
    return this.userService.registerUser(userModel);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'User JWT information should be displayed',
    type: PayloadModel,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AuthGuard())
  public async getUser(@Request() { user }): Promise<UserModel> {
    const userModel: UserModel = JSON.parse(this.cryptoService.decryptText(user.userDetails));
    return await this.userService.getUser(userModel);
  }

  @Put()
  @ApiResponse({
    status: 200,
    description: 'User properties are successful updated',
    type: UserModel,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AuthGuard())
  public async updateUser(@Request() { user }, @Body() userModel: UserModel): Promise<any> {
    const authenticationDetails: UserModel = JSON.parse(this.cryptoService.decryptText(user.userDetails));
    Object.assign(userModel, authenticationDetails);
    return await this.userService.updateUser(userModel);
  }

  @Delete()
  @ApiResponse({
    status: 200,
    description: 'User is successful successfully deleted',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AuthGuard())
  public async deleteUser(@Request() { user }, @Body() userModel: UserModel) {
    const authenticationDetails: UserModel = JSON.parse(this.cryptoService.decryptText(user.userDetails));
    Object.assign(userModel, authenticationDetails);
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
    @Response() response: ExpressResponse,
  ): Promise<any> {
    const token = await this.userService.createToken(userModel);
    response.set('Authorization', `Bearer ${token.accessToken}`);
    response.send(token);
  }

  @Put('auth')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'User password is successful changed.',
    type: UserModel,
  })
  @ApiResponse({ status: 400, description: 'Forbidden' })
  public async changePassword(
    @Body() userModel: UserModel,
  ): Promise<any> {
    return await this.userService.changePassword(userModel);
  }
}
