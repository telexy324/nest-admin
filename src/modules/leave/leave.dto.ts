import { ApiProperty, PartialType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsArray,
  IsDecimal,
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator'
import { PagerDto } from '~/common/dto/pager.dto'

export enum LeaveType {
  /** 调休 */
  COMPENSATE = 1,
  /** 年假 */
  ANNUAL = 2,
  /** 病假 */
  SICK = 3,
  /** 事假 */
  PERSONAL = 4,
  /** 其他 */
  OTHER = 5,
}

export enum LeaveStatus {
  /** 等待 */
  PENDING = 1,
  /** 批准 */
  APPROVED = 2,
  /** 驳回 */
  REJECTED = 3,
  /** 取消 */
  CANCELED = 4,
}

export class LeaveDto {
  @ApiProperty({ description: '申请时长' })
  @IsString()
  @IsDecimal({ decimal_digits: '1,2' }, { message: 'amount 必须是最多两位小数的数字字符串' })
  amount: string

  @ApiProperty({
    description: `
请假类型:
- 1: 调休
- 2: 年假   
- 3: 病假
- 4: 事假
- 5: 其他  
    `,
    enum: LeaveType,
  })
  @IsIn([1, 2, 3, 4, 5])
  type: LeaveType

  @ApiProperty({ description: '开始时间', example: '2025-04-30 15:30:00' })
  @Matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, {
    message: '开始时间格式应为 yyyy-MM-dd HH:mm:ss',
  })
  startDate: string

  @ApiProperty({ description: '结束时间', example: '2025-04-30 17:45:00' })
  @Matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, {
    message: '结束时间格式应为 yyyy-MM-dd HH:mm:ss',
  })
  endDate: string

  @ApiProperty({ description: '请假事由' })
  @IsString()
  @MinLength(8)
  reason: string

  @ApiProperty({ description: '请假佐证' })
  @IsOptional()
  @IsArray()
  @Type(() => String)
  @IsString({ each: true })
  proof?: string[] | null

  @ApiProperty({ description: '评论' })
  @IsString()
  @IsOptional()
  comment?: string

  @ApiProperty({
    description: `
状态:
- 1: 等待
- 2: 批准   
- 3: 驳回
- 4: 取消
    `,
    enum: LeaveStatus,
  })
  @IsIn([1, 2, 3])
  status: LeaveStatus
}

export class LeaveUpdateDto extends PartialType(LeaveDto) {
}

export class LeaveQueryDto extends PagerDto {
  @ApiProperty({
    description: `
请假类型:
- 1: 调休
- 2: 年假   
- 3: 病假
- 4: 事假
- 5: 其他  
    `,
    enum: LeaveType,
  })
  @IsOptional()
  @IsIn([1, 2, 3, 4, 5])
  type?: LeaveType

  @ApiProperty({
    description: `
状态:
- 1: 等待
- 2: 批准   
- 3: 驳回
- 4: 取消
    `,
    enum: LeaveStatus,
  })
  @IsOptional()
  @IsIn([1, 2, 3])
  status?: LeaveStatus

  @ApiProperty({ description: '开始时间', example: '2025-04-30 15:30:00' })
  @Matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, {
    message: '开始时间格式应为 yyyy-MM-dd HH:mm:ss',
  })
  @IsOptional()
  startDate?: string

  @ApiProperty({ description: '结束时间', example: '2025-04-30 17:45:00' })
  @Matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, {
    message: '结束时间格式应为 yyyy-MM-dd HH:mm:ss',
  })
  @IsOptional()
  endDate?: string
}

export class LeaveBalanceDto {
  @ApiProperty({ description: '申请时长' })
  @IsString()
  @IsDecimal({ decimal_digits: '1,2' }, { message: 'amount 必须是最多两位小数的数字字符串' })
  amount: string

  @ApiProperty({
    description: `
请假类型:
- 1: 调休
- 2: 年假   
- 3: 病假
- 4: 事假
- 5: 其他  
    `,
    enum: LeaveType,
  })
  @IsIn([1, 2, 3, 4, 5])
  type: LeaveType

  @ApiProperty({ description: '开始时间', example: '2025-04-30 15:30:00' })
  @Matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, {
    message: '开始时间格式应为 yyyy-MM-dd HH:mm:ss',
  })
  startDate: string

  @ApiProperty({ description: '结束时间', example: '2025-04-30 17:45:00' })
  @Matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, {
    message: '结束时间格式应为 yyyy-MM-dd HH:mm:ss',
  })
  endDate: string

  @ApiProperty({ description: '请假事由' })
  @IsString()
  @MinLength(8)
  reason: string

  @ApiProperty({ description: '请假佐证' })
  @IsString()
  @IsOptional()
  proof?: string

  @ApiProperty({ description: '评论' })
  @IsString()
  @IsOptional()
  comment?: string
}

export class LeaveBalanceUpdateDto extends PartialType(LeaveBalanceDto) {
}

export class LeaveBalanceQueryDto extends PagerDto {
  @ApiProperty({
    description: `
请假类型:
- 1: 调休
- 2: 年假   
- 3: 病假
- 4: 事假
- 5: 其他  
    `,
    enum: LeaveType,
  })
  @IsOptional()
  @IsIn([1, 2, 3, 4, 5])
  type?: LeaveType

  @ApiProperty({ description: '开始时间', example: '2025-04-30 15:30:00' })
  @Matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, {
    message: '开始时间格式应为 yyyy-MM-dd HH:mm:ss',
  })
  @IsOptional()
  startDate?: string

  @ApiProperty({ description: '结束时间', example: '2025-04-30 17:45:00' })
  @Matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, {
    message: '结束时间格式应为 yyyy-MM-dd HH:mm:ss',
  })
  @IsOptional()
  endDate?: string
}
