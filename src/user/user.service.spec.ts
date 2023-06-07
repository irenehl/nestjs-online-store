import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '@config/prisma.service';
import { MockContext, createMockContext } from '@mocks/prisma.mock';
import userMock from '@user/mocks/user.mock';

describe('UserService', () => {
    let service: UserService;
    let prisma: MockContext;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserService, PrismaService],
        })
            .overrideProvider(PrismaService)
            .useValue(createMockContext())
            .compile();

        service = module.get<UserService>(UserService);
        prisma = module.get<MockContext>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findOne', () => {
        it('should return a user', async () => {
            // Arrange
            prisma.user.findUnique.mockResolvedValueOnce(userMock);

            // Act
            const result = await service.findOne({
                email: 'danielalopez@ravn.co',
            });

            // Assert
            expect(result).toMatchObject(userMock);
        });

        it('should throw NotFound when user does not exists', async () => {
            // Arrange
            prisma.user.findUnique.mockResolvedValueOnce(null);

            // Act & Assert
            await expect(
                service.findOne({ email: 'danielalopez@ravn.co' })
            ).rejects.toThrow('User not found');
        });
    });

    describe('create', () => {
        // it('should add user', async () => {
        //     // Arrange
        //     prisma.user.findUnique.mockResolvedValueOnce(null);
        //     prisma.user.create.mockResolvedValueOnce(userMock);
        //     // Act
        //     const result = await service.create({})
        // })
    });
});
