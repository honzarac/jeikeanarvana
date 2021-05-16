import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import {getRepository} from "typeorm";
import {CapacityLog} from "./CapacityLog/capacitylog.entity";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  async root() {
    const statesDescriptions = {
      'low': 'nikdo tam není, upaluj pro novou POKAL skleničku',
      'normal': 'ještě to ujde',
      'high': 'ani tam nechoď, je tam kozy moc lidí'
    };

    const lastCapacityLog = await getRepository(CapacityLog).findOne({ order: { time: 'DESC' }})

    const capacity = 1200
    const current = lastCapacityLog.capacity

    let currentStateDescription = '';
    if (current < 400) { currentStateDescription = statesDescriptions['low']; }
    else if (current < 800) { currentStateDescription = statesDescriptions['normal']; }
    else { currentStateDescription = statesDescriptions['high']; }

    let progressColors = ['green', 'green', 'green', 'yellow', 'yellow', 'yellow', 'red', 'red', 'red']
    progressColors = progressColors.slice(0, Math.round((current/capacity)*9))

    return {
      isFullDescription: current > 600 ? 'ANO' : 'NE',
      currentStateDescription: currentStateDescription,
      current: current,
      progressColors: progressColors
    }
  }
}
