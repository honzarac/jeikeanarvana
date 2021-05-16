import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    root(): Promise<{
        isFullDescription: string;
        currentStateDescription: string;
        current: number;
        maxCapacity: number;
        coloredPieces: number;
        capacityHistory: any[];
    }>;
}
