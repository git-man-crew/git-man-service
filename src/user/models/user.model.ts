import { ApiModelProperty } from '@nestjs/swagger';

export class UserModel {
  @ApiModelProperty({
    description: 'eMail address of the user',
    readOnly: true,
    required: true,
    example: 'mạnh-phước.nguyễn@king-of-nerds.io',
  })
  readonly email: string = '';

  @ApiModelProperty({
    description: 'Password of the user',
    readOnly: true,
    required: true,
    example: 'TopSecretPassword',
  })
  readonly password?: string = '';

  @ApiModelProperty({
    description: 'New password of the user',
    readOnly: true,
    required: false,
    example: 'TopSecretPasswordNew',
  })
  readonly newPassword?: string = '';

  @ApiModelProperty({
    description: 'birthdate of the user',
    readOnly: true,
    required: false,
    example: '13.12.1955',
  })
  readonly birthdate?: string = '';

  @ApiModelProperty({
    description: 'Phone number of the user',
    readOnly: true,
    required: false,
    example: '+491775558762',
  })
  readonly phoneNumber?: string = '';

  @ApiModelProperty({
    description: 'Full name of the user',
    readOnly: true,
    required: false,
    example: 'Mạnh Phước Nguyễn',
  })
  readonly name?: string = '';

  @ApiModelProperty({
    description: 'User ID of the user',
    readOnly: true,
    required: false,
    example: 'eae6c741-f78d-4957-82ab-e4e2a9294ea5',
  })
  readonly sub?: string = '';

  @ApiModelProperty({
    description: 'Boolean flag which indicates the email verification after the user registration',
    readOnly: true,
    required: false,
    example: 'true',
  })
  readonly emailVerified?: string = '';

  @ApiModelProperty({
    description: 'Boolean flag which indicates the phone number verification after the user registration',
    readOnly: true,
    required: false,
    example: 'false',
  })
  readonly phoneNumberVerified?: string = '';

  @ApiModelProperty({
    description: 'Preferrered username of the registered user',
    readOnly: true,
    required: false,
    example: 'false',
  })
  readonly preferredUsername?: string = 'leon1jaekel@aol.com';
}
