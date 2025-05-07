import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { ApiResult } from '~/common/decorators/api-result.decorator'
import { IdParam } from '~/common/decorators/id-param.decorator'

import { Pagination } from '~/helper/paginate/pagination'
import { AuthUser } from '~/modules/auth/decorators/auth-user.decorator'
import { definePermission, Perm } from '~/modules/auth/decorators/permission.decorator'
import { Resource } from '~/modules/auth/decorators/resource.decorator'

import { ResourceGuard } from '~/modules/auth/guards/resource.guard'
import { LeaveBalanceEntity, LeaveEntity } from '~/modules/leave/leave.entity'

import { LeaveStats } from '~/modules/leave/leave.model'
import { LeaveBalanceQueryDto, LeaveDto, LeaveQueryDto, LeaveStatus, LeaveUpdateDto } from './leave.dto'
import { LeaveService } from './leave.service'

export const permissions = definePermission('leave', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const)

@ApiTags('Business - Leave模块')
@UseGuards(ResourceGuard)
@Controller('leaves')
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Get()
  @ApiOperation({ summary: '获取Leave列表' })
  @ApiResult({ type: [LeaveEntity] })
  @Perm(permissions.LIST)
  async list(@Query() dto: LeaveQueryDto): Promise<Pagination<LeaveEntity>> {
    return this.leaveService.list(dto)
  }

  @Get(':id')
  @ApiOperation({ summary: '获取Leave详情' })
  @ApiResult({ type: LeaveEntity })
  @Perm(permissions.READ)
  async info(@IdParam() id: number): Promise<LeaveEntity> {
    return this.leaveService.detail(id)
  }

  @Post()
  @ApiOperation({ summary: '创建Leave' })
  @Perm(permissions.CREATE)
  async create(@Body() dto: LeaveDto): Promise<void> {
    await this.leaveService.create(dto)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新Leave' })
  @Perm(permissions.UPDATE)
  @Resource(LeaveEntity)
  async update(@IdParam() id: number, @Body()dto: LeaveUpdateDto): Promise<void> {
    await this.leaveService.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除Leave' })
  @Perm(permissions.DELETE)
  @Resource(LeaveEntity)
  async delete(@IdParam() id: number): Promise<void> {
    await this.leaveService.delete(id)
  }

  @Put(':id/cancel')
  @ApiOperation({ summary: '取消Leave' })
  @Perm(permissions.UPDATE)
  @Resource(LeaveEntity)
  async cancel(@AuthUser() user: IAuthUser, @IdParam() id: number, @Body()dto: LeaveUpdateDto): Promise<void> {
    await this.leaveService.cancel(id, dto, user)
  }

  @Put(':id/approve')
  @ApiOperation({ summary: '批准Leave' })
  @Perm(permissions.UPDATE)
  @Resource(LeaveEntity)
  async approve(@IdParam() id: number, @Body()dto: LeaveUpdateDto): Promise<void> {
    dto.status = LeaveStatus.APPROVED
    await this.leaveService.approve(id, dto)
  }

  @Put(':id/reject')
  @ApiOperation({ summary: '驳回Leave' })
  @Perm(permissions.UPDATE)
  @Resource(LeaveEntity)
  async reject(@IdParam() id: number, @Body()dto: LeaveUpdateDto): Promise<void> {
    dto.status = LeaveStatus.REJECTED
    await this.leaveService.reject(id, dto)
  }

  @Get('stats')
  @ApiOperation({ summary: '获取Leave统计' })
  @ApiResult({ type: LeaveStats })
  @Perm(permissions.READ)
  async stats(@AuthUser() user: IAuthUser): Promise<LeaveStats> {
    return this.leaveService.stats(user.uid)
  }

  @Get('balance')
  @ApiOperation({ summary: '获取LeaveBalance列表' })
  @ApiResult({ type: [LeaveBalanceEntity] })
  @Perm(permissions.LIST)
  async listBalance(@AuthUser() user: IAuthUser, @Query() dto: LeaveBalanceQueryDto): Promise<Pagination<LeaveBalanceEntity>> {
    return this.leaveService.listBalance(user, dto)
  }

  @Get('balance/:id')
  @ApiOperation({ summary: '获取LeaveBalance详情' })
  @ApiResult({ type: LeaveEntity })
  @Perm(permissions.READ)
  async infoBalance(@IdParam() id: number): Promise<LeaveBalanceEntity> {
    return this.leaveService.detailBalance(id)
  }

  @Post('balance')
  @ApiOperation({ summary: '创建LeaveBalance' })
  @Perm(permissions.CREATE)
  async createBalance(@Body() dto: LeaveDto): Promise<void> {
    await this.leaveService.createBalance(dto)
  }

  @Put('balance/:id')
  @ApiOperation({ summary: '更新LeaveBalance' })
  @Perm(permissions.UPDATE)
  @Resource(LeaveBalanceEntity)
  async updateBalance(@IdParam() id: number, @Body()dto: LeaveUpdateDto): Promise<void> {
    await this.leaveService.updateBalance(id, dto)
  }

  @Delete('balance/:id')
  @ApiOperation({ summary: '删除LeaveBalance' })
  @Perm(permissions.DELETE)
  @Resource(LeaveBalanceEntity)
  async deleteBalance(@IdParam() id: number): Promise<void> {
    await this.leaveService.deleteBalance(id)
  }
}
