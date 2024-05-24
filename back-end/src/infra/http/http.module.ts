import { AuthenticateAssignorService } from '@/domain/application/services/assignor/authenticate-assignor'
import { ChangePasswordService } from '@/domain/application/services/assignor/change-password'
import { CreateAssignorService } from '@/domain/application/services/assignor/create-assignor'
import { DeleteAssignorService } from '@/domain/application/services/assignor/delete-assignor'
import { FindAssignorByIdService } from '@/domain/application/services/assignor/find-assignor-by-id'
import { UpdateAssignorService } from '@/domain/application/services/assignor/update-assignor'
import { BatchCreationService } from '@/domain/application/services/payable/batch-creation'
import { CreatePayableService } from '@/domain/application/services/payable/create-payable'
import { DeletePayableService } from '@/domain/application/services/payable/delete-payable'
import { FindPayableByIdService } from '@/domain/application/services/payable/find-payable-by-id'
import { FindPayablesService } from '@/domain/application/services/payable/find-payables'
import { UpdatePayableService } from '@/domain/application/services/payable/update-payable'
import { Module } from '@nestjs/common'
import { BrokerModule } from '../broker/broker.module'
import { CacheModule } from '../cache/cache.module'
import { CryptographyModule } from '../cryptography/cryptograpy.module'
import { DatabaseModule } from '../database/database.module'
import { MailModule } from '../mail/mail.module'
import { ChangePasswordController } from './controllers/assignor/change-password/change-password'
import { CreateAssignorController } from './controllers/assignor/create-assignor/create-assignor'
import { DeleteAssignorController } from './controllers/assignor/delete-assignor/delete-assignor'
import { FindAssignorByIdController } from './controllers/assignor/find-assignor-by-id/find-assignor-by-id'
import { UpdateAssignorController } from './controllers/assignor/update-assignor/update-assignor'
import { AuthenticateAssignorController } from './controllers/authentication/authenticate-user-controller'
import { BatchConsumerController } from './controllers/batch/batch-consumer'
import { BatchProducerController } from './controllers/batch/batch-producer'
import { CreatePayableController } from './controllers/payable/create-payable/create-payable'
import { DeletePayableController } from './controllers/payable/delete-payable/delete-payable'
import { FindPayableByIdController } from './controllers/payable/find-payable-by-id/find-payable-by-id'
import { FindPayablesController } from './controllers/payable/find-payables/find-payables'
import { UpdatePayableController } from './controllers/payable/update-payable/update-payable'

@Module({
  imports: [
    DatabaseModule,
    CryptographyModule,
    CacheModule,
    BrokerModule,
    MailModule,
  ],
  controllers: [
    AuthenticateAssignorController,
    ChangePasswordController,
    CreateAssignorController,
    UpdateAssignorController,
    DeleteAssignorController,
    FindAssignorByIdController,
    CreatePayableController,
    DeletePayableController,
    UpdatePayableController,
    FindPayableByIdController,
    FindPayablesController,
    BatchProducerController,
    BatchConsumerController,
  ],
  providers: [
    AuthenticateAssignorService,
    ChangePasswordService,
    CreateAssignorService,
    ChangePasswordService,
    UpdateAssignorService,
    DeleteAssignorService,
    FindAssignorByIdService,
    CreatePayableService,
    DeletePayableService,
    UpdatePayableService,
    FindPayableByIdService,
    FindPayablesService,
    BatchCreationService,
  ],
})
export class HttpModule {}
