import {HttpModule, HttpService, Module} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {WatcherController} from "./watcher.controller";
import {CapacityLog} from "./CapacityLog/capacitylog.entity";
import {IkeaCapacityService} from "./CapacityLog/ikeacapacity.service";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'ikea',
      password: 'pass',
      database: 'ikea-dev',
      entities: [CapacityLog],
      synchronize: true,
    }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [AppController, WatcherController],
  providers: [AppService, IkeaCapacityService],
})
export class AppModule {}
