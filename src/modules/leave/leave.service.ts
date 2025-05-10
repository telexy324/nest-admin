import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'
import { paginate } from '~/helper/paginate'
import { Pagination } from '~/helper/paginate/pagination'
import { LeaveBalanceEntity, LeaveEntity } from '~/modules/leave/leave.entity'
import { LeaveStats } from '~/modules/leave/leave.model'
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
    type,
    status,
    startDate,
    endDate,
    page,
    pageSize,
  }: LeaveQueryDto): Promise<Pagination<LeaveEntity>> {
    const queryBuilder = this.leaveRepository.createQueryBuilder('leave').orderBy({ updated_at: 'DESC' }).where({
      ...(type && { type }),
      ...(status && { status }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    })
    return paginate(queryBuilder, { page, pageSize })
  }

  async detail(id: number): Promise<LeaveEntity> {
    const item = await this.leaveRepository.findOne({
      where: { id },
      relations: ['user', 'approver'], // 👈 手动指定要加载的关联字段
    })
    // const item = await this.leaveRepository
    //   .createQueryBuilder('leave')
    //   .leftJoinAndSelect('leave.user', 'user')
    //   .leftJoinAndSelect('leave.approver', 'approver')
    //   .where('leave.id = :id', { id })
    //   .getOne()
    if (!item)
      throw new NotFoundException('未找到该记录')

    return item
  }

  async create(uid: number, dto: LeaveDto) {
    await this.leaveRepository.save({
      ...dto,
      user: {
        id: uid,
      },
    })
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

  async approve(uid: number, id: number, dto: LeaveUpdateDto) {
    const withAdmin = {
      ...dto,
      approver: {
        id: uid,
      },
    }
    await this.leaveRepository.update(id, withAdmin)
    const item = await this.detail(id)
    await this.leaveBalanceRepository.insert({
      type: dto.type,
      amount: `-${item.amount}`,
      user: {
        id: item.user.id,
      },
    })
  }

  async reject(uid: number, id: number, dto: LeaveUpdateDto) {
    const withAdmin = {
      ...dto,
      approver: {
        id: uid,
      },
    }
    await this.leaveRepository.update(id, withAdmin)
  }

  async stats(uid: number): Promise<LeaveStats> {
    const rawResult = await this.leaveBalanceRepository
      .createQueryBuilder('leave')
      .select('leave.type', 'type')
      .addSelect('SUM(CASE WHEN leave.amount >= 0 THEN leave.amount ELSE 0 END)', 'total_positive')
      .addSelect('SUM(CASE WHEN leave.amount < 0 THEN leave.amount ELSE 0 END)', 'total_negative')
      .where('leave.user_id = :userId', { userId: uid }) // ✅ 只统计指定用户
      .groupBy('leave.type')
      .getRawMany<{
      type: number
      total_positive: string
      total_negative: string
    }>()

    const stats = new LeaveStats()

    // 初始化所有字段为 0
    Object.assign(stats, {
      totalCompensatoryLeaves: 0,
      usedCompensatoryLeaves: 0,
      totalAnnualLeaves: 0,
      usedAnnualLeaves: 0,
      totalSickLeaves: 0,
      usedSickLeaves: 0,
      totalPersonalLeaves: 0,
      usedPersonalLeaves: 0,
    })

    for (const row of rawResult) {
      const total = Number.parseFloat(row.total_positive || '0')
      const used = Math.abs(Number.parseFloat(row.total_negative || '0'))

      switch (row.type) {
        case 1: // 调休
          stats.totalCompensatoryLeaves = total
          stats.usedCompensatoryLeaves = used
          break
        case 2: // 年假
          stats.totalAnnualLeaves = total
          stats.usedAnnualLeaves = used
          break
        case 3: // 病假
          stats.totalSickLeaves = total
          stats.usedSickLeaves = used
          break
        case 4: // 事假
          stats.totalPersonalLeaves = total
          stats.usedPersonalLeaves = used
          break
      }
    }

    return stats
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
