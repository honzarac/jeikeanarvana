import {HttpModule, HttpService, Module} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {WatcherController} from "./watcher.controller";
import {CapacityLog} from "./CapacityLog/capacitylog.entity";
import {IkeaCapacityService} from "./CapacityLog/ikeacapacity.service";
import {ScheduleModule} from "@nestjs/schedule";
import {CronService} from "./cron.service";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [CapacityLog],
      synchronize: true,
    }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    ScheduleModule.forRoot()
  ],
  controllers: [AppController, WatcherController],
  providers: [AppService, IkeaCapacityService, CronService],
})
export class AppModule {}
