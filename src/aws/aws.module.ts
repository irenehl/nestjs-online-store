import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Service } from './s3.service';

@Module({
    providers: [ConfigService, S3Service],
    exports: [S3Service],
})
export class AwsModule {}
