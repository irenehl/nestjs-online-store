import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { PayloadDto } from '@auth/dtos/payload.dto';
import { User } from '@user/decorators/user.decorator';
import { Role } from '@auth/decorators/role.decorator';
import { RolesGuard } from '@auth/guards/role.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Order } from '@prisma/client';

@ApiTags('Order')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('order')
export class OrderController {
    constructor(private orderService: OrderService) {}

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Order> {
        return this.orderService.findOne({ id: Number(id) });
    }

    @Get()
    @Role('MANAGER')
    @UseGuards(RolesGuard)
    async findAll(
        @Query('page') page: string,
        @Query('limit') limit: string
    ): Promise<Order[]> {
        return this.orderService.findAll({ page, limit });
    }

    @Post()
    async placeOrder(@User() user: PayloadDto): Promise<Order> {
        return this.orderService.placeOrder(user.sub);
    }
}
