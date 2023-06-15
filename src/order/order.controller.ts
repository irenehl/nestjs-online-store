import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { PayloadDto } from '@auth/dtos/payload.dto';
import { User } from '@user/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('order')
export class OrderController {
    constructor(private orderService: OrderService) {}

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.orderService.findOne({ id: Number(id) });
    }

    @Get()
    async findAll(@Query('page') page: string, @Query('limit') limit: string) {
        return this.orderService.findAll({ page, limit });
    }

    @Post()
    async placeOrder(@User() user: PayloadDto) {
        return this.orderService.placeOrder(Number(user.sub));
    }
}
