import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AttendancesModule } from './attendances/attendances.module';
import { AuthModule } from './auth/auth.module';
import { EmployeesModule } from './employees/employees.module';
import { NotificationsModule } from './notifications/notifications.module';
import { OrdersModule } from './order/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EmployeesModule,
    AttendancesModule,
    AuthModule,
    OrdersModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
