import { IkeaCapacityService } from "./CapacityLog/ikeacapacity.service";
export declare class WatcherController {
    private readonly ikeaCapacityService;
    constructor(ikeaCapacityService: IkeaCapacityService);
    root(): Promise<{
        status: string;
        capacity: number;
    }>;
}
