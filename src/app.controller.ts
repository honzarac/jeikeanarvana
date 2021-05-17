import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import {getConnection, getRepository} from "typeorm";
import {CapacityLog} from "./CapacityLog/capacitylog.entity";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  async root() {
    const statesDescriptions = {
      'low': 'nikdo tam není, upaluj pro novou POKAL skleničku',
      'normal': 'ale ještě to ujde',
      'high': 'ani tam nechoď, je tam kozy moc lidí'
    };

    const capacityLogRepository = getRepository(CapacityLog)
    const lastCapacityLog = await capacityLogRepository.findOne({ order: { time: 'DESC' }})

    const maxCapacity = 1200
    const current = lastCapacityLog.capacity

    let currentStateDescription = '';
    if (current < 400) { currentStateDescription = statesDescriptions['low']; }
    else if (current < 800) { currentStateDescription = statesDescriptions['normal']; }
    else { currentStateDescription = statesDescriptions['high']; }

    let coloredPieces = Math.round((current/maxCapacity)*9);

    const capacityHistory = await getConnection()
        .createQueryBuilder()
        .from(CapacityLog, 'capacity_log')
        .select('to_char(time, \'YY-MM-DD_HH24\') as date, round(avg(capacity)) as avg, max(capacity) as max, min(capacity) as min')
        .where('DATE(time) >= CURRENT_DATE - interval \'1 day\'')
        .groupBy('to_char(time, \'YY-MM-DD_HH24\')')
        .orderBy('to_char(time, \'YY-MM-DD_HH24\')', 'DESC')
        .limit(5)
        .getRawMany();

    return {
      currentStateDescription: currentStateDescription,
      current: current,
      maxCapacity: maxCapacity,
      coloredPieces: coloredPieces,
      capacityHistory: capacityHistory
    }
  }
}
