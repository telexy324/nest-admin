import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Storage } from '~/modules/tools/storage/storage.entity'
import { UserEntity } from '~/modules/user/user.entity'
import { LeaveController } from './leave.controller'
import { LeaveBalanceEntity, LeaveEntity } from './leave.entity'
import { LeaveService } from './leave.service'

const services = [LeaveService]

@Module({
  imports: [
    TypeOrmModule.forFeature([LeaveEntity]),
    TypeOrmModule.forFeature([LeaveBalanceEntity]),
    TypeOrmModule.forFeature([Storage]),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [LeaveController],
  providers: [...services],
  exports: [TypeOrmModule, ...services],
})
export class LeaveModule {}
