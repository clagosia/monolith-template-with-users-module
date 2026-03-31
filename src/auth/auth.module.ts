import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserCredential } from './entities/user-credential.entity';
import { UserRole } from './access-control/entities/user-role.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersModule } from '../users/users.module';
import { AccessControlModule } from './access-control/access-control.module';
import {
  ValidateUserUseCase,
  RegisterUseCase,
  LoginUseCase,
  GetProfileUseCase,
  UpdatePasswordUseCase,
  UpdateUsernameUseCase,
  SoftDeleteCredentialUseCase,
  HardDeleteCredentialUseCase,
  PasswordRecoveryUseCase,
  ResetPasswordUseCase,
} from './use-cases';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserCredential, UserRole]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): JwtModuleOptions => ({
        secret:
          configService.get<string>('jwt.secret') ?? 'default-secret-change-me',
        signOptions: {
          expiresIn: Number(
            configService.get<string>('jwt.expiration') ?? '3600',
          ),
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AccessControlModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
    ValidateUserUseCase,
    RegisterUseCase,
    LoginUseCase,
    GetProfileUseCase,
    UpdatePasswordUseCase,
    UpdateUsernameUseCase,
    SoftDeleteCredentialUseCase,
    HardDeleteCredentialUseCase,
    PasswordRecoveryUseCase,
    ResetPasswordUseCase,
  ],
  exports: [AuthService],
})
export class AuthModule {}
