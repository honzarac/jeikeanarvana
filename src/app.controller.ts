import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  root() {
    const statesDescriptions = {
      'less': "je prázdná, jak ",
      '24': "pohodinda",
      '36': "pohodinda",
      '48': "pohodinda",
      '60': "pohodinda",
      '72': "pohodinda",
      '84': "je tam kozy moc lidí",
      '100': "ja"
    };

    const capacity = 1200
    const current = 1100

    let progressColors = ['green', 'green', 'green', 'yellow', 'yellow', 'yellow', 'red', 'red', 'red']
    progressColors = progressColors.slice(0, Math.round((current/capacity)*9))

    return {
      statesDescriptions: statesDescriptions, 
      current: current,
      progressColors: progressColors
    }
  }
}
