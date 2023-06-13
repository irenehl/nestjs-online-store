import { Injectable } from '@nestjs/common';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { ConfigService } from '@nestjs/config';

interface MailParams {
    toAddresses: string[];
    htmlData: string;
    subject: string;
    source: string;
}

interface MailInfo {
    htmlTemplate: string;
    subject: string;
    toAddresses: string[];
    textReplacer: (html: string) => string;
}

@Injectable()
export class MailService {
    private readonly sesClient = SESClient;

    constructor(sesClient: SESClient, private configService: ConfigService) {
        this.sesClient = sesClient;
    }

    private createParams(mailParams: MailParams) {
        return {
            Destination: {
                ToAddresses: mailParams.toAddresses,
            },
            Message: {
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: mailParams.htmlData,
                    },
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: mailParams.subject,
                },
            },
            Source: mailParams.source,
        };
    }

    async sendEmail({
        htmlTemplate,
        subject,
        toAddresses,
        textReplacer,
    }: MailInfo) {
        const htmlData = textReplacer(htmlTemplate);
        const mailParams = this.createParams({
            toAddresses,
            htmlData,
            subject,
            source: this.configService.get<string>('MAIL_IDENTITY')!,
        });

        // return this.sesClient.send(new SendEmailCommand(mailParams));
    }
}
