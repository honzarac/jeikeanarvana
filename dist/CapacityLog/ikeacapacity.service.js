"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IkeaCapacityService = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const typeorm_1 = require("typeorm");
const capacitylog_entity_1 = require("./capacitylog.entity");
let IkeaCapacityService = class IkeaCapacityService {
    constructor(httpService) {
        this.httpService = httpService;
        this.ikeaCapacityUrl = 'https://ikeastorevisitorcounter.azurewebsites.net/store/status/278?lang=cs';
    }
    async scrapeCurrentCapacity() {
        let response = await this.getIkeaCapacityResponse();
        let matches = response.match(/<div class="small-box-number">([0-9]+)<\/div>/g);
        let capacity = matches.map((string) => parseInt(string.replace(/<\/?div[- ="A-Z0-9]*>/gi, '')));
        const capacityLogRepository = typeorm_1.getRepository(capacitylog_entity_1.CapacityLog);
        let capacityLog = new capacitylog_entity_1.CapacityLog;
        capacityLog.capacity = capacity[0];
        await capacityLogRepository.insert(capacityLog);
        return capacity[0];
    }
    getIkeaCapacityResponse() {
        return this.httpService
            .get(this.ikeaCapacityUrl)
            .pipe(operators_1.map((response) => response.data))
            .toPromise();
    }
};
IkeaCapacityService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [common_1.HttpService])
], IkeaCapacityService);
exports.IkeaCapacityService = IkeaCapacityService;
//# sourceMappingURL=ikeacapacity.service.js.map