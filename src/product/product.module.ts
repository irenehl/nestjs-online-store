import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from '@config/prisma.service';
import { S3Service } from 'src/aws/s3.service';
import { AwsModule } from 'src/aws/aws.module';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [AwsModule],
    providers: [ProductService, PrismaService, S3Service, ConfigService],
    controllers: [ProductController],
})
export class ProductModule {}
