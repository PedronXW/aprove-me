import { AssignorRepository } from '@/domain/application/repositories/assignor-repository'
import { PayableRepository } from '@/domain/application/repositories/payable-repository'
import { UserRepository } from '@/domain/application/repositories/user-repository'
import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaAssignorRepository } from './prisma/repositories/prisma-assignor-repository'
import { PrismaPayableRepository } from './prisma/repositories/prisma-payable-repository'
import { PrismaUserRepository } from './prisma/repositories/prisma-user-repository'

@Module({
  imports: [],
  controllers: [],
  providers: [
    PrismaService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: PayableRepository,
      useClass: PrismaPayableRepository,
    },
    {
      provide: AssignorRepository,
      useClass: PrismaAssignorRepository,
    },
  ],
  exports: [
    PrismaService,
    UserRepository,
    PayableRepository,
    AssignorRepository,
  ],
})
export class DatabaseModule {}
