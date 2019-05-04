import { ApiModelProperty } from "@nestjs/swagger";

export class UserModel {
  @ApiModelProperty({
    description: 'eMail address of the user',
    readOnly: true,
    required: true,
    example: 'mạnh-phước.nguyễn@king-of-nerds.io',
  })
  readonly email: string;

  @ApiModelProperty({
    description: 'Password of the user',
    readOnly: true,
    required: true,
    example: 'TopSecretPassword',
  })
  readonly password: string;

  @ApiModelProperty({
    description: 'birthdate of the user',
    readOnly: true,
    required: false,
    example: '13.12.1955',
  })
  readonly birthDate?: string;

  @ApiModelProperty({
    description: 'Phone number of the user',
    readOnly: true,
    required: false,
    example: '+491775558762',
  })
  readonly phoneNumber?: string;

  @ApiModelProperty({
    description: 'Full name of the user',
    readOnly: true,
    required: false,
    example: 'Mạnh Phước Nguyễn',
  })
  readonly name?: string;
}
