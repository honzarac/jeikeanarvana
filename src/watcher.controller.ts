import { Controller, Get, Render } from '@nestjs/common';
import {IkeaCapacityService} from "./CapacityLog/ikeacapacity.service";
import {getRepository} from "typeorm";
import {CapacityLog} from "./CapacityLog/capacitylog.entity";

@Controller('/api/watcher')
export class WatcherController {
  constructor(private readonly ikeaCapacityService: IkeaCapacityService) {}

  @Get()
  async root() {

    const capacityLogRepository = getRepository(CapacityLog);
    let capacityLog = new CapacityLog;
    capacityLog.capacity = await this.ikeaCapacityService.scrapeCurrentCapacity();
    await capacityLogRepository.insert(capacityLog);

    return {
      status: "ok",
      capacity: capacityLog.capacity
    }
  }
}
