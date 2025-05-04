import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { LeaveController } from './leave.controller'
import { LeaveBalanceEntity, LeaveEntity } from './leave.entity'
import { LeaveService } from './leave.service'

const services = [LeaveService]

@Module({
  imports: [TypeOrmModule.forFeature([LeaveEntity]), TypeOrmModule.forFeature([LeaveBalanceEntity])],
  controllers: [LeaveController],
  providers: [...services],
  exports: [TypeOrmModule, ...services],
})
export class LeaveModule {}
