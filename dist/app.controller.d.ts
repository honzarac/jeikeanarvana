import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    root(): {
        statesDescriptions: {
            less: string;
            '24': string;
            '36': string;
            '48': string;
            '60': string;
            '72': string;
            '84': string;
            '100': string;
        };
        current: number;
        progressColors: string[];
    };
}
