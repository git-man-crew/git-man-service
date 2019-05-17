import { Injectable } from '@nestjs/common';
import { randomBytes, createCipher, Cipher, createDecipher } from 'crypto';
import cryptoRandomString = require('crypto-random-string');
import { ConfigService } from '../../config/service/config.service';

@Injectable()
export class CryptoService {
    private readonly key: Buffer = randomBytes(32);
    private readonly iv: Buffer = randomBytes(16);
    private readonly algorithm: string = 'aes-256-cbc';
    private readonly password: string = cryptoRandomString({
        length: Number.parseInt(this.configService.getSystemProperty('CRYPTO_SECRET_LENGTH'), 10),
    });

    constructor(private readonly configService: ConfigService) { }

    public encryptText(text: string): string {
        const cipher: Cipher = createCipher(this.algorithm, this.password);
        let encrypted: string = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }

    public decryptText(encryptedData: string) {
        const decipher = createDecipher(this.algorithm, this.password);
        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}
