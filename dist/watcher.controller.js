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
exports.WatcherController = void 0;
const common_1 = require("@nestjs/common");
const ikeacapacity_service_1 = require("./CapacityLog/ikeacapacity.service");
const typeorm_1 = require("typeorm");
const capacitylog_entity_1 = require("./CapacityLog/capacitylog.entity");
let WatcherController = class WatcherController {
    constructor(ikeaCapacityService) {
        this.ikeaCapacityService = ikeaCapacityService;
    }
    async root() {
        const capacityLogRepository = typeorm_1.getRepository(capacitylog_entity_1.CapacityLog);
        let capacityLog = new capacitylog_entity_1.CapacityLog;
        capacityLog.capacity = await this.ikeaCapacityService.scrapeCurrentCapacity();
        await capacityLogRepository.insert(capacityLog);
        return {
            status: "ok",
            capacity: capacityLog.capacity
        };
    }
};
__decorate([
    common_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WatcherController.prototype, "root", null);
WatcherController = __decorate([
    common_1.Controller('/api/watcher'),
    __metadata("design:paramtypes", [ikeacapacity_service_1.IkeaCapacityService])
], WatcherController);
exports.WatcherController = WatcherController;
//# sourceMappingURL=watcher.controller.js.map