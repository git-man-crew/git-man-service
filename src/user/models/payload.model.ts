import { ApiModelProperty } from '@nestjs/swagger';

export class PayloadModel {
  @ApiModelProperty({
    description: 'eMail address of the user',
    readOnly: true,
    example: 'mạnh-phước.nguyễn@king-of-nerds.io',
  })
  readonly user: string;

  @ApiModelProperty({
    description: 'Access token of the user',
    readOnly: true,
    required: true,
    example:
      'eyJraWQiOiJUYlwvOVhrRTMzMU1UMGF2QVQzc1NkamExc2ZRZXJvaUJEVlwvbjd...',
  })
  readonly accessToken: string;

  @ApiModelProperty({
    description: 'ID token of the user',
    readOnly: true,
    required: true,
    example:
      'eyJraWQiOiJTdXYxR1hzVkZ0K2JleHNDdU5IUllqNUpsbWVoSWxFSHJnSkFxRDlZ...',
  })
  readonly idToken: string;

  @ApiModelProperty({
    description: 'Refresh token of the user',
    readOnly: true,
    required: true,
    example:
      'eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.j...',
  })
  readonly refreshToken?: string;

  @ApiModelProperty({
    description: 'iat of the user session',
    readOnly: true,
    required: true,
    example: 1556957360,
  })
  readonly iat?: number;

  @ApiModelProperty({
    description: 'Expiration time of the user session',
    readOnly: true,
    required: true,
    example: 1556960960,
  })
  readonly exp?: number;
}
