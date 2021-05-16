import { Controller, Get, Render } from '@nestjs/common';
import {IkeaCapacityService} from "./CapacityLog/ikeacapacity.service";

@Controller('/api/watcher')
export class WatcherController {
  constructor(private readonly ikeaCapacityService: IkeaCapacityService) {}

  @Get()
  async root() {
    return {
      status: "ok",
      capacity: await this.ikeaCapacityService.scrapeCurrentCapacity()
    }
  }
}
