import { ApiProperty } from '@nestjs/swagger'

export class LeaveStats {
  @ApiProperty({ description: '调休总天数' })
  totalCompensatoryLeaves: number

  @ApiProperty({ description: '调休已使用天数' })
  usedCompensatoryLeaves: number

  @ApiProperty({ description: '年假总天数' })
  totalAnnualLeaves: number

  @ApiProperty({ description: '年假已使用天数' })
  usedAnnualLeaves: number

  @ApiProperty({ description: '病假总天数' })
  totalSickLeaves: number

  @ApiProperty({ description: '病假已使用天数' })
  usedSickLeaves: number

  @ApiProperty({ description: '事假总天数' })
  totalPersonalLeaves: number

  @ApiProperty({ description: '事假已使用天数' })
  usedPersonalLeaves: number
}
