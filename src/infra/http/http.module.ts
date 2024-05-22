import { CreateAssignorService } from '@/domain/application/services/assignor/create-assignor'
import { DeleteAssignorService } from '@/domain/application/services/assignor/delete-assignor'
import { FindAssignorByIdService } from '@/domain/application/services/assignor/find-assignor-by-id'
import { FindAssignorsService } from '@/domain/application/services/assignor/find-assignors'
import { UpdateAssignorService } from '@/domain/application/services/assignor/update-assignor'
import { CreatePayableService } from '@/domain/application/services/payable/create-payable'
import { DeletePayableService } from '@/domain/application/services/payable/delete-payable'
import { FindPayableByIdService } from '@/domain/application/services/payable/find-payable-by-id'
import { FindPayablesService } from '@/domain/application/services/payable/find-payables'
import { UpdatePayableService } from '@/domain/application/services/payable/update-payable'
import { AuthenticateUserService } from '@/domain/application/services/user/authenticate-user'
import { ChangePasswordService } from '@/domain/application/services/user/change-password'
import { CreateUserService } from '@/domain/application/services/user/create-user'
import { DeleteUserService } from '@/domain/application/services/user/delete-user'
import { FindUserByEmailService } from '@/domain/application/services/user/find-user-by-email'
import { FindUserByIdService } from '@/domain/application/services/user/find-user-by-id'
import { UpdateUserService } from '@/domain/application/services/user/update-user'
import { Module } from '@nestjs/common'
import { CacheModule } from '../cache/cache.module'
import { CryptographyModule } from '../cryptography/cryptograpy.module'
import { DatabaseModule } from '../database/database.module'
import { CreateAssignorController } from './controllers/assignor/create-assignor/create-assignor'
import { DeleteAssignorController } from './controllers/assignor/delete-assignor/delete-assignor'
import { FindAssignorByIdController } from './controllers/assignor/find-assignor-by-id/find-assignor-by-id'
import { FindAssignorsController } from './controllers/assignor/find-assignors/find-assignors'
import { UpdateAssignorController } from './controllers/assignor/update-assignor/update-assignor'
import { AuthenticateUserController } from './controllers/authentication/authenticate-user-controller'
import { CreatePayableController } from './controllers/payable/create-payable/create-payable'
import { DeletePayableController } from './controllers/payable/delete-payable/delete-payable'
import { FindPayableByIdController } from './controllers/payable/find-payable-by-id/find-payable-by-id'
import { FindPayablesController } from './controllers/payable/find-payables/find-payables'
import { UpdatePayableController } from './controllers/payable/update-payable/update-payable'
import { ChangePasswordController } from './controllers/user/change-password/change-password'
import { CreateUserController } from './controllers/user/create-user/create-user'
import { DeleteUserController } from './controllers/user/delete-user/delete-user'
import { FindUserByIdController } from './controllers/user/find-user-by-id/find-user-by-id'
import { UpdateUserController } from './controllers/user/update-user/update-user'

@Module({
  imports: [DatabaseModule, CryptographyModule, CacheModule],
  controllers: [
    AuthenticateUserController,
    CreateUserController,
    DeleteUserController,
    UpdateUserController,
    ChangePasswordController,
    FindUserByIdController,
    CreateAssignorController,
    UpdateAssignorController,
    DeleteAssignorController,
    FindAssignorByIdController,
    FindAssignorsController,
    CreatePayableController,
    DeletePayableController,
    UpdatePayableController,
    FindPayableByIdController,
    FindPayablesController,
  ],
  providers: [
    AuthenticateUserService,
    CreateUserService,
    DeleteUserService,
    UpdateUserService,
    ChangePasswordService,
    FindUserByEmailService,
    FindUserByIdService,
    CreateAssignorService,
    UpdateAssignorService,
    DeleteAssignorService,
    FindAssignorByIdService,
    FindAssignorsService,
    CreatePayableService,
    DeletePayableService,
    UpdatePayableService,
    FindPayableByIdService,
    FindPayablesService,
  ],
})
export class HttpModule {}
