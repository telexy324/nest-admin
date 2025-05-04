import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'
import { paginate } from '~/helper/paginate'
import { Pagination } from '~/helper/paginate/pagination'
import { LeaveBalanceEntity, LeaveEntity } from '~/modules/leave/leave.entity'

import {
  LeaveBalanceDto,
  LeaveBalanceUpdateDto,
  LeaveDto,
  LeaveQueryDto,
  LeaveStatus,
  LeaveUpdateDto,
} from './leave.dto'

@Injectable()
export class LeaveService {
  constructor(
    @InjectRepository(LeaveEntity)
    private leaveRepository: Repository<LeaveEntity>,
    @InjectRepository(LeaveBalanceEntity)
    private leaveBalanceRepository: Repository<LeaveBalanceEntity>,
  ) {}

  async list({
    page,
    pageSize,
  }: LeaveQueryDto): Promise<Pagination<LeaveEntity>> {
    return paginate(this.leaveRepository, { page, pageSize })
  }

  async detail(id: number): Promise<LeaveEntity> {
    const item = await this.leaveRepository.findOneBy({ id })
    if (!item)
      throw new NotFoundException('未找到该记录')

    return item
  }

  async create(dto: LeaveDto) {
    await this.leaveRepository.save(dto)
  }

  async update(id: number, dto: LeaveUpdateDto) {
    await this.leaveRepository.update(id, dto)
  }

  async delete(id: number) {
    const item = await this.detail(id)

    await this.leaveRepository.remove(item)
  }

  async cancel(id: number, dto: LeaveUpdateDto, user: IAuthUser) {
    const item = await this.detail(id)
    if (item.user.id !== user.uid) {
      throw new BusinessException(ErrorEnum.LEAVE_NOT_BELONG)
    }
    if (item.status !== LeaveStatus.PENDING) {
      throw new BusinessException(ErrorEnum.LEAVE_CANNOT_CANCEL)
    }
    await this.leaveRepository.update(id, dto)
  }

  async approve(id: number, dto: LeaveUpdateDto) {
    await this.leaveRepository.update(id, dto)
    const item = await this.detail(id)
    const balance = this.leaveBalanceRepository.insert({
      type: dto.type,
      amount: `-${dto.amount}`,
      user: {
        id: item.user.id,
      },
    })
  }

  async reject(id: number, dto: LeaveUpdateDto) {
    await this.leaveRepository.update(id, dto)
  }

  async listBalance(user: IAuthUser, {
    page,
    pageSize,
  }: LeaveQueryDto): Promise<Pagination<LeaveBalanceEntity>> {
    const queryBuilder = this.leaveBalanceRepository
      .createQueryBuilder('leaveBalance')
      .where({
        ...(user ? { user } : null),
      })
      .orderBy('created_at', 'ASC')

    return paginate(queryBuilder, { page, pageSize })
  }

  async detailBalance(id: number): Promise<LeaveBalanceEntity> {
    const item = await this.leaveBalanceRepository.findOneBy({ id })
    if (!item)
      throw new NotFoundException('未找到该记录')

    return item
  }

  async createBalance(dto: LeaveBalanceDto) {
    await this.leaveBalanceRepository.save(dto)
  }

  async updateBalance(id: number, dto: LeaveBalanceUpdateDto) {
    await this.leaveBalanceRepository.update(id, dto)
  }

  async deleteBalance(id: number) {
    const item = await this.detailBalance(id)

    await this.leaveBalanceRepository.remove(item)
  }
}
