import { HttpService } from '@nestjs/common';
export declare class IkeaCapacityService {
    private httpService;
    constructor(httpService: HttpService);
    ikeaCapacityUrl: string;
    scrapeCurrentCapacity(): Promise<number>;
    getIkeaCapacityResponse(): Promise<string>;
}
