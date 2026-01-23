import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PoolService } from './pool.service';
import { CreatePoolDto } from './dto/create-pool.dto';
import { UpdatePoolDto } from './dto/update-pool.dto';
import { PaginationDto } from 'src/common/types/paginated';
import { UpdatePoolStatusDto } from './dto/update-pool-status.dto';

@Controller('pool')
export class PoolController {
  constructor(private readonly poolService: PoolService) {}

  @Post()
  create(@Body() createPoolDto: CreatePoolDto) {
    return this.poolService.create(createPoolDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.poolService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.poolService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePoolDto: UpdatePoolDto) {
    return this.poolService.update(id, updatePoolDto);
  }

  @Patch(':id/assign-employee/:employeeId')
  addEmployee(
    @Param('id') id: string,
    @Param('employeeId') employeeId: string,
  ) {
    return this.poolService.addEmployee(id, employeeId);
  }

  @Patch(':id/remove-employee/:employeeId')
  removeEmployee(
    @Param('id') id: string,
    @Param('employeeId') employeeId: string,
  ) {
    return this.poolService.removeEmployee(id, employeeId);
  }

  @Patch(':id/update-status')
  updatePoolStatus(@Param('id') id: string, @Body() dto: UpdatePoolStatusDto) {
    return this.poolService.updatePoolStatus(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.poolService.remove(id);
  }
}
