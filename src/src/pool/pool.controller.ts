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
import { Auth } from 'src/common/decorators/auth.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('pools')
export class PoolController {
  constructor(private readonly poolService: PoolService) {}

  @Auth([UserRole.ADMIN])
  @Post()
  create(@Body() createPoolDto: CreatePoolDto) {
    return this.poolService.create(createPoolDto);
  }

  @Auth([UserRole.ADMIN])
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.poolService.findAll(paginationDto);
  }

  @Auth([UserRole.ADMIN, UserRole.EMPLOYEE])
  @Get('find-by-employee/:employeeId')
  findByEmployee(@Param('employeeId') employeeId: string) {
    return this.poolService.findByEmployee(employeeId);
  }

  @Auth([UserRole.ADMIN, UserRole.EMPLOYEE])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.poolService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePoolDto: UpdatePoolDto) {
    return this.poolService.update(id, updatePoolDto);
  }

  @Auth([UserRole.ADMIN])
  @Patch(':id/assign-employee/:employeeId')
  addEmployee(
    @Param('id') id: string,
    @Param('employeeId') employeeId: string,
  ) {
    return this.poolService.addEmployee(id, employeeId);
  }

  @Auth([UserRole.ADMIN])
  @Patch(':id/remove-employee/:employeeId')
  removeEmployee(
    @Param('id') id: string,
    @Param('employeeId') employeeId: string,
  ) {
    return this.poolService.removeEmployee(id, employeeId);
  }

  @Auth([UserRole.ADMIN])
  @Patch(':id/update-status')
  updatePoolStatus(@Param('id') id: string, @Body() dto: UpdatePoolStatusDto) {
    return this.poolService.updatePoolStatus(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.poolService.remove(id);
  }
}
