import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import {IkeaCapacityService} from "./CapacityLog/ikeacapacity.service";

@Injectable()
export class CronService {
    constructor(private readonly ikeaCapacityService: IkeaCapacityService) {}

    private readonly logger = new Logger(CronService.name);

    @Cron('30 * 9-21 * * *')
    async handleCron() {
        this.logger.debug('scraping current capacity...')
        const currentCapacity = await this.ikeaCapacityService.scrapeCurrentCapacity()
        this.logger.debug('done... current capacity is '+ currentCapacity)
    }
}
