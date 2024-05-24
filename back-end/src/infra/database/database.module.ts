import { AssignorRepository } from '@/domain/application/repositories/assignor-repository'
import { PayableRepository } from '@/domain/application/repositories/payable-repository'
import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaAssignorRepository } from './prisma/repositories/prisma-assignor-repository'
import { PrismaPayableRepository } from './prisma/repositories/prisma-payable-repository'

@Module({
  imports: [],
  controllers: [],
  providers: [
    PrismaService,
    {
      provide: PayableRepository,
      useClass: PrismaPayableRepository,
    },
    {
      provide: AssignorRepository,
      useClass: PrismaAssignorRepository,
    },
  ],
  exports: [PrismaService, PayableRepository, AssignorRepository],
})
export class DatabaseModule {}
