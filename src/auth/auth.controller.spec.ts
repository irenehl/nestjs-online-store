import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '@user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@config/prisma.service';
import { userMock } from '@user/mocks/user.mock';
import { SesService } from '@aws/ses.service';
import { createSESMock } from '@mocks/ses.mock';

describe('AuthController', () => {
    let controller: AuthController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        validate: jest.fn(),
                        login: jest.fn(() => ({
                            access_token: 'a',
                        })),
                    },
                },
                UserService,
                JwtService,
                ConfigService,
                PrismaService,
                SesService,
            ],
            controllers: [AuthController],
        })
            .overrideProvider(SesService)
            .useValue(createSESMock())
            .compile();

        controller = module.get<AuthController>(AuthController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('login', () => {
        it('should return an array of users', async () => {
            expect(await controller.login(userMock)).toBeDefined();
        });
    });
});
