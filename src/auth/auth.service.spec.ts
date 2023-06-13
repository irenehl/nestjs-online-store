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
            prisma.user.findUniqueOrThrow.mockResolvedValueOnce(userMock);

            // Act
            const result = await service.validateUser(
                userMock.email,
                'pass123'
            );

            // Assert
            expect(prisma.user.findUniqueOrThrow).toHaveBeenCalled();
            expect(result).toHaveProperty('id', expect.any(Number));
        });

        it('should fail when validate an user', async () => {
            // Arrange
            prisma.user.findUniqueOrThrow.mockResolvedValue(userMock);

            // Act
            const result = await service.validateUser(userMock.email, 'pass');

            // Act && Assert
            expect(result).toEqual(false);
        });
    });

    describe('login', () => {
        it('should generate a token from an user', async () => {
            // Arrange
            const result = await service.login(userMock);

            // Act & Assert
            expect(result).toHaveProperty('access_token', expect.any(String));
        });
    });
});
