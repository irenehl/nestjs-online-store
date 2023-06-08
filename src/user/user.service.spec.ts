import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '@config/prisma.service';
import { MockContext, createMockContext } from '@mocks/prisma.mock';
import { allUsersMock, updatedUserMock, userMock } from './mocks/user.mock';

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

    describe('findAll', () => {
        it('should find all users', async () => {
            // Arrange
            prisma.user.findMany.mockResolvedValueOnce(allUsersMock);

            const page = 1;
            const limit = 15;

            // Act
            const result = await service.findAll({ page, limit });

            // Assert
            expect(result).toMatchObject(allUsersMock);
        });
    });

    describe('update', () => {
        it('should update an user', async () => {
            // Arrange
            prisma.user.findUnique.mockResolvedValueOnce(userMock);
            prisma.user.update.mockResolvedValueOnce(updatedUserMock);

            const info = {
                username: 'daniela',
            };

            // Act
            const result = await service.update(userMock.id, info);

            // Assert
            expect(result).toMatchObject(updatedUserMock);
            expect(result.username).toEqual('daniela');
        });

        it('should fail when update an user that does not exists', async () => {
            // Arrange
            prisma.user.findUnique.mockResolvedValue(null);

            const info = {
                username: 'daniela',
            };

            // Act & Assert
            await expect(service.update(1000, info)).rejects.toThrow(
                'User not found'
            );
        });
    });

    describe('delete', () => {
        it('should delete an user', async () => {
            // Arrange
            prisma.user.findUnique.mockResolvedValueOnce(userMock);
            prisma.user.delete.mockResolvedValue(userMock);

            // Act
            const result = await service.delete(userMock.id);

            // Assert
            expect(result).toMatchObject(userMock);
        });

        it('should fail when delete an user that does not exists', async () => {
            // Arrange
            prisma.user.findUnique.mockResolvedValueOnce(null);

            // Act & assert
            await expect(service.delete(1000)).rejects.toThrow(
                'User not found'
            );
        });
    });
});
