import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '@config/prisma.service';
import { ConfigService } from '@nestjs/config';
import { UserService } from '@user/user.service';
import { JwtService } from '@nestjs/jwt';
import { MockContext, createMockContext } from '@mocks/prisma.mock';
import { userMock } from '@user/mocks/user.mock';

describe('AuthService', () => {
    let service: AuthService;
    let prisma: MockContext;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                PrismaService,
                ConfigService,
                UserService,
                JwtService,
            ],
        })
            .overrideProvider(PrismaService)
            .useValue(createMockContext())
            .compile();

        service = module.get<AuthService>(AuthService);
        prisma = module.get<MockContext>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('validateUser', () => {
        it('should validate an user', async () => {
            // Arrange
            prisma.user.findUnique.mockResolvedValueOnce(userMock);

            // Act
            const result = await service.validateUser(
                userMock.email,
                'pass123'
            );

            // Assert
            expect(prisma.user.findUnique).toHaveBeenCalled();
            expect(result).toHaveProperty('id', expect.any(Number));
        });
    });

    describe('login', () => {
        it('should generate a token from an user', async () => {
            const result = await service.login(userMock);

            expect(result).toHaveProperty('access_token', expect.any(String));
        });
    });
});
