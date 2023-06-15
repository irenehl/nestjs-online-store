import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { PrismaService } from '@config/prisma.service';
import { MockContext, createMockContext } from '@mocks/prisma.mock';
import {
    allProductsMock,
    productMock,
    updateProductMock,
} from './mocks/product.mock';

describe('ProductService', () => {
    let service: ProductService;
    let prisma: MockContext;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ProductService, PrismaService],
        })
            .overrideProvider(PrismaService)
            .useValue(createMockContext())
            .compile();

        service = module.get<ProductService>(ProductService);
        prisma = module.get<MockContext>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a new product', async () => {
            // Arrange
            prisma.product.create.mockResolvedValue(productMock);

            // Act
            const result = await service.create({
                name: 'P2',
                description: 'lorem ipsum',
                price: 12.3,
                stock: 3,
                image: null,
                available: true,
                category: 'LOREM',
            });

            // Assert
            expect(result).toMatchObject(productMock);
            expect(result).toHaveProperty('SKU', expect.any(Number));
        });
    });

    describe('findOne', () => {
        it('should find one product by sku', async () => {
            // Arrange
            prisma.product.findUniqueOrThrow.mockResolvedValueOnce(productMock);

            // Act
            const result = await service.findOne({ SKU: productMock.SKU });

            // Assert
            expect(prisma.product.findUniqueOrThrow).toHaveBeenCalled();
            expect(result).toHaveProperty('SKU', expect.any(Number));
        });

        it('should fail when product does not exists', async () => {
            // Arrange
            prisma.product.findUniqueOrThrow.mockRejectedValueOnce(null);

            // Act & Arrange
            await expect(service.findOne({ SKU: 100 })).rejects.toThrow(
                'Product 100 not found'
            );
        });
    });

    describe('findAll', () => {
        it('should find all products', async () => {
            // Arrange
            prisma.product.findMany.mockResolvedValue(allProductsMock);

            const page = '1';
            const limit = '15';

            // Act
            const result = await service.findAll({ page, limit });

            // Assert
            expect(result).toMatchObject(allProductsMock);
        });
    });

    describe('update', () => {
        it('should update a product', async () => {
            // Arrange
            prisma.product.findUniqueOrThrow.mockResolvedValue(productMock);
            prisma.product.update.mockResolvedValue({
                ...productMock,
                name: 'updated product',
            });

            // Act
            const result = await service.update(productMock.SKU, {
                name: 'updated product ',
            });

            // Assert
            expect(prisma.product.findUniqueOrThrow).toHaveBeenCalled();
            expect(result.name).toEqual('updated product');
            expect(result).toMatchObject(updateProductMock);
        });

        it('should fail when updated a product that does not exists', async () => {
            // Arrange
            prisma.product.findUniqueOrThrow.mockRejectedValueOnce(null);

            // Act & assert
            await expect(
                service.update(1000, { name: 'updated product' })
            ).rejects.toThrow('Product 1000 not found');
        });
    });

    describe('toggle', () => {
        it('should change available status', async () => {
            // Arrange
            prisma.product.findUniqueOrThrow.mockResolvedValueOnce(productMock);
            prisma.product.update.mockResolvedValueOnce({
                ...productMock,
                available: false,
            });

            // Act
            const result = await service.toggle(productMock.SKU);

            expect(result.available).toEqual(false);
            expect(prisma.product.update).toHaveBeenCalled();
        });

        it('should delete products on carts', async () => {
            // Arrange
            prisma.product.findUniqueOrThrow.mockResolvedValueOnce(productMock);
            prisma.product.update.mockResolvedValueOnce(productMock);
            prisma.productsOnCarts.deleteMany.mockResolvedValueOnce({
                count: 0,
            });

            // Act
            const result = await service.toggle(productMock.SKU);

            // Assert
            expect(result.available).toEqual(true);
            expect(prisma.product.update).toHaveBeenCalled();
        });
    });

    describe('delete', () => {
        it('should delete a product', async () => {
            // Arrange
            prisma.product.findUniqueOrThrow.mockResolvedValue(productMock);
            prisma.product.delete.mockResolvedValue(productMock);

            // Act
            const result = await service.delete(productMock.SKU);

            // Assert
            expect(prisma.product.findUniqueOrThrow).toHaveBeenCalled();
            expect(result).toHaveProperty('SKU', expect.any(Number));
        });

        it('should fail when updated a product that does not exists', async () => {
            // Arrange
            prisma.product.findUniqueOrThrow.mockRejectedValueOnce(null);

            // Act & assert
            await expect(service.delete(1000)).rejects.toThrow(
                'Product 1000 not found'
            );
        });
    });
});
