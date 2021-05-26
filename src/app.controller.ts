import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import {getConnection, getRepository} from "typeorm";
import {CapacityLog} from "./CapacityLog/capacitylog.entity";
import { normal } from "color-blend";

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

    const capacityLastFiveHours = await getConnection()
        .createQueryBuilder()
        .from(CapacityLog, 'capacity_log')
        .select('to_char(time, \'YY-MM-DD_HH24\') as date, round(avg(capacity)) as avg, max(capacity) as max, min(capacity) as min')
        .where('DATE(time) >= CURRENT_DATE - interval \'1 day\'')
        .groupBy('to_char(time, \'YY-MM-DD_HH24\')')
        .orderBy('to_char(time, \'YY-MM-DD_HH24\')', 'DESC')
        .limit(5)
        .getRawMany()

    const capacityHistory = await getConnection()
        .createQueryBuilder()
        .from(CapacityLog, 'capacity_log')
        .select('to_char(time, \'DY\') as weekday,\n' +
            'avg(case when to_char(time, \'HH24\')::integer < 12 then capacity else null end) as cap9_12,\n' +
            'avg(case when to_char(time, \'HH24\')::integer >= 12 and to_char(time, \'HH24\')::integer < 15 then capacity else null end) as cap12_15,\n' +
            'avg(case when to_char(time, \'HH24\')::integer >= 15 and to_char(time, \'HH24\')::integer < 18 then capacity else null end) as cap15_18,\n' +
            'avg(case when to_char(time, \'HH24\')::integer >= 18 and to_char(time, \'HH24\')::integer < 21 then capacity else null end) as cap18_21')
        .groupBy('to_char(time, \'DY\')')
        .orderBy('CASE WHEN to_char(max(time), \'D\') = \'1\' THEN 8 ELSE to_char(max(time), \'D\')::integer END', 'ASC')
        .getRawMany();

    const colorBlend = (capacity: number) => {
      var percentColors = [
        { pct: 0.0, color: { r: 0x00, g: 0xff, b: 0 } },
        { pct: 0.5, color: { r: 0xff, g: 0xff, b: 0 } },
        { pct: 1.0, color: { r: 0xff, g: 0x00, b: 0 } }
      ];

      let pct = (capacity/1200)
      for (var i = 1; i < percentColors.length - 1; i++) {
        if (pct < percentColors[i].pct) {
          break;
        }
      }
      var lower = percentColors[i - 1];
      var upper = percentColors[i];
      var range = upper.pct - lower.pct;
      var rangePct = (pct - lower.pct) / range;
      var pctLower = 1 - rangePct;
      var pctUpper = rangePct;
      var color = {
        r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
        g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
        b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
      };
      return 'background-color: rgb(' + [color.r, color.g, color.b].join(',') + ')';
    }

    return {
      currentStateDescription: currentStateDescription,
      current: current,
      maxCapacity: maxCapacity,
      coloredPieces: coloredPieces,
      capacityLastFiveHours: capacityLastFiveHours,
      capacityHistory: capacityHistory,
      colorBlend: colorBlend
    }
  }
}
