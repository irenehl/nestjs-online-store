import {
    DeleteObjectCommand,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
    private s3: S3Client;

    constructor(private configService: ConfigService) {
        this.s3 = new S3Client({ region: 'us-east-2' });
    }

    private buildFileName(originalName: string) {
        return `${new Date().toISOString()}_${originalName}`;
    }

    private buildObjectUrl(originalName: string) {
        return `${this.configService.get<string>(
            'AWS_BUCKET_HOST'
        )}/${originalName}`;
    }

    async uploadFile(file: Express.Multer.File) {
        const fileName = this.buildFileName(file.originalname);

        const command = new PutObjectCommand({
            Bucket: this.configService.get<string>('AWS_BUCKET_NAME'),
            Key: fileName,
            Body: file.buffer,
            Tagging: 'public=yes',
            ContentType: file.mimetype,
        });

        const result = await this.s3.send(command);
        const url = this.buildObjectUrl(fileName);

        return {
            result,
            fileName,
            url,
        };
    }

    async removeFile(fileName: string) {
        const command = new DeleteObjectCommand({
            Bucket: this.configService.get<string>('AWS_BUCKET_NAME'),
            Key: this.buildObjectUrl(fileName),
        });

        return this.s3.send(command);
    }

    async replaceFile(file: Express.Multer.File, fileName: string) {
        const newFile = await this.uploadFile(file);

        await this.removeFile(fileName);

        return newFile;
    }
}
