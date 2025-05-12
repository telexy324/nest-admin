import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm'

import { CommonEntity } from '~/common/entity/common.entity'
import { UserEntity } from '~/modules/user/user.entity'

@Entity('leave')
export class LeaveEntity extends CommonEntity {
  @Column({
    type: 'decimal',
    precision: 10, // 总位数（整数 + 小数）
    scale: 2, // 小数位数
  })
  amount: string

  @Column({ type: 'tinyint', default: 1 })
  @ApiProperty({ description: 'status: 1:PENDING, 2:APPROVED, 3:REJECTED, 4:CANCELLED' })
  status: number

  @Column({ type: 'tinyint', default: 1 })
  @ApiProperty({ description: 'type: 1:COMPENSATE, 2:ANNUAL, 3:SICK, 4:PERSONAL, 5:OTHER' })
  type: number

  @Column({ name: 'start_date', type: 'datetime', nullable: true })
  @ApiProperty({ description: '开始时间' })
  startDate: Date

  @Column({ name: 'end_date', type: 'datetime', nullable: true })
  @ApiProperty({ description: '结束时间' })
  endDate: Date

  @Column()
  reason: string

  @Column('simple-json', { nullable: true })
  proof: string[] | null

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: Relation<UserEntity>

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'approver_id' })
  approver: Relation<UserEntity>

  @Column({ nullable: true })
  comment: string

  @Column({ name: 'done_at', type: 'datetime', nullable: true })
  doneAt: Date
}

@Entity('leave_balance')
export class LeaveBalanceEntity extends CommonEntity {
  @Column({ type: 'tinyint', default: 1 })
  @ApiProperty({ description: 'status: 1:COMPENSATE, 2:ANNUAL, 3:SICK, 4:PERSONAL, 5:OTHER' })
  type: number

  @Column({
    type: 'decimal',
    precision: 10, // 总位数（整数 + 小数）
    scale: 2, // 小数位数
  })
  amount: string // ⚠️ 建议用 string 类型，避免 JS 浮点误差

  @Column({ type: 'int', nullable: true, name: 'consume_time', default: 0 })
  @ApiProperty({ description: '年度' })
  year: number

  @Column({ type: 'tinyint', default: 1 })
  @ApiProperty({ description: 'status: 1:REQUEST, 2:CANCEL' })
  action: number

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: Relation<UserEntity>
}
