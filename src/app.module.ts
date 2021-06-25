import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { UserRepository } from './user/user.repository';
import { ConfigModule } from '@nestjs/config';
import { SendGridModule } from '@anchan828/nest-sendgrid';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forRoot(typeOrmConfig), UserModule, SendGridModule.forRoot({
    apikey: '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',
  }), AuthModule,],
  controllers: [AppController],
  providers: [AppService, UserService, UserRepository],
})
export class AppModule {}
