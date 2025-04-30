import { ApiProperty, PartialType } from '@nestjs/swagger'
import {
  IsDecimal,
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator'

enum LeaveType {
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
  @IsString()
  @IsOptional()
  proof?: string

  @ApiProperty({ description: '评论' })
  @IsString()
  @IsOptional()
  comment?: string
}

export class LeaveUpdateDto extends PartialType(LeaveDto) {
}

export class LeaveQueryDto extends PartialType(LeaveDto) {
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
