import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.positionsService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':position_id')
  async getOne(@Param('position_id') position_id: string) {
    return this.positionsService.findById(+position_id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: any, @Request() req: any) {
    const { position_code, position_name } = body;
    const user = req.user;

    if (!position_code?.trim()) throw new BadRequestException('Position code is required.');
    if (!position_name?.trim()) throw new BadRequestException('Position name is required.');
    if (!user?.userId) throw new BadRequestException('User info missing from token.');

    return this.positionsService.createPosition(position_code, position_name, user.userId);
  }

  @UseGuards(JwtAuthGuard)
@Put(':position_id')
async update(@Param('position_id') position_id: string, @Body() body: any) {

  const updatedData = {
    positions_code: body.position_code,  
    positions_name: body.position_name,
  };

  return this.positionsService.updatePosition(+position_id, updatedData);
}


  @UseGuards(JwtAuthGuard)
  @Delete(':position_id')
  async remove(@Param('position_id') position_id: string) {
    return this.positionsService.deletePosition(+position_id);
  }
}
