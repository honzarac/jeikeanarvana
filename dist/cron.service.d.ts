import { IkeaCapacityService } from "./CapacityLog/ikeacapacity.service";
export declare class CronService {
    private readonly ikeaCapacityService;
    constructor(ikeaCapacityService: IkeaCapacityService);
    private readonly logger;
    handleCron(): Promise<void>;
}
