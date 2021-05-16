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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const typeorm_1 = require("typeorm");
const capacitylog_entity_1 = require("./CapacityLog/capacitylog.entity");
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    async root() {
        const statesDescriptions = {
            'low': 'nikdo tam není, upaluj pro novou POKAL skleničku',
            'normal': 'ale ještě to ujde',
            'high': 'ani tam nechoď, je tam kozy moc lidí'
        };
        const capacityLogRepository = typeorm_1.getRepository(capacitylog_entity_1.CapacityLog);
        const lastCapacityLog = await capacityLogRepository.findOne({ order: { time: 'DESC' } });
        const maxCapacity = 1200;
        const current = lastCapacityLog.capacity;
        let currentStateDescription = '';
        if (current < 400) {
            currentStateDescription = statesDescriptions['low'];
        }
        else if (current < 800) {
            currentStateDescription = statesDescriptions['normal'];
        }
        else {
            currentStateDescription = statesDescriptions['high'];
        }
        let coloredPieces = Math.round((current / maxCapacity) * 9);
        const capacityHistory = await typeorm_1.getConnection()
            .createQueryBuilder()
            .from(capacitylog_entity_1.CapacityLog, 'capacity_log')
            .select('to_char(time, \'YY-MM-DD_HH24\') as date, round(avg(capacity)) as avg, max(capacity) as max, min(capacity) as min')
            .where('DATE(time)=CURRENT_DATE')
            .groupBy('to_char(time, \'YY-MM-DD_HH24\')')
            .orderBy('to_char(time, \'YY-MM-DD_HH24\')', 'DESC')
            .limit(5)
            .getRawMany();
        return {
            isFullDescription: current > 600 ? 'ANO' : 'NE',
            currentStateDescription: currentStateDescription,
            current: current,
            maxCapacity: maxCapacity,
            coloredPieces: coloredPieces,
            capacityHistory: capacityHistory
        };
    }
};
__decorate([
    common_1.Get(),
    common_1.Render('index'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "root", null);
AppController = __decorate([
    common_1.Controller(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map