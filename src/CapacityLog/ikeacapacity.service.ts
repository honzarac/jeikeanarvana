import {HttpService, Injectable} from '@nestjs/common';
import {map} from "rxjs/operators";
import {getRepository} from "typeorm";
import {CapacityLog} from "./capacitylog.entity";

@Injectable()
export class IkeaCapacityService {
  constructor(private httpService: HttpService) {}

  ikeaCapacityUrl = 'https://ikeastorevisitorcounter.azurewebsites.net/store/status/278?lang=cs';

  async scrapeCurrentCapacity(): Promise<number> {
    let response = await this.getIkeaCapacityResponse();

    let matches = response.match(/<div class="small-box-number">([0-9]+)<\/div>/g);
    let capacity = matches.map((string) => parseInt(string.replace(/<\/?div[- ="A-Z0-9]*>/gi, '')));

    const capacityLogRepository = getRepository(CapacityLog);
    let capacityLog = new CapacityLog;
    capacityLog.capacity = capacity[0];
    await capacityLogRepository.insert(capacityLog);

    return capacity[0];
  }

  getIkeaCapacityResponse(): Promise<string> {
    return this.httpService
        .get(this.ikeaCapacityUrl)
        .pipe(map((response) => response.data))
        .toPromise();
  }
}
