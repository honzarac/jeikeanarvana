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
        const capacityLastFiveHours = await typeorm_1.getConnection()
            .createQueryBuilder()
            .from(capacitylog_entity_1.CapacityLog, 'capacity_log')
            .select('to_char(time, \'YY-MM-DD_HH24\') as date, round(avg(capacity)) as avg, max(capacity) as max, min(capacity) as min')
            .where('DATE(time) >= CURRENT_DATE - interval \'1 day\'')
            .groupBy('to_char(time, \'YY-MM-DD_HH24\')')
            .orderBy('to_char(time, \'YY-MM-DD_HH24\')', 'DESC')
            .limit(5)
            .getRawMany();
        const capacityHistory = await typeorm_1.getConnection()
            .createQueryBuilder()
            .from(capacitylog_entity_1.CapacityLog, 'capacity_log')
            .select('to_char(time, \'DY\') as weekday,\n' +
            'avg(case when to_char(time, \'HH24\')::integer < 12 then capacity else null end) as cap9_12,\n' +
            'avg(case when to_char(time, \'HH24\')::integer >= 12 and to_char(time, \'HH24\')::integer < 15 then capacity else null end) as cap12_15,\n' +
            'avg(case when to_char(time, \'HH24\')::integer >= 15 and to_char(time, \'HH24\')::integer < 18 then capacity else null end) as cap15_18,\n' +
            'avg(case when to_char(time, \'HH24\')::integer >= 18 and to_char(time, \'HH24\')::integer < 21 then capacity else null end) as cap18_21')
            .groupBy('to_char(time, \'DY\')')
            .orderBy('CASE WHEN to_char(max(time), \'D\') = \'1\' THEN 8 ELSE to_char(max(time), \'D\')::integer END', 'ASC')
            .getRawMany();
        const colorBlend = (capacity) => {
            var percentColors = [
                { pct: 0.0, color: { r: 0x00, g: 0xff, b: 0 } },
                { pct: 0.5, color: { r: 0xff, g: 0xff, b: 0 } },
                { pct: 1.0, color: { r: 0xff, g: 0x00, b: 0 } }
            ];
            let pct = (capacity / 1200);
            for (var i = 1; i < percentColors.length - 1; i++) {
                if (pct < percentColors[i].pct) {
                    break;
                }
            }
            var lower = percentColors[i - 1];
            var upper = percentColors[i];
            var range = upper.pct - lower.pct;
            var rangePct = (pct - lower.pct) / range;
            var pctLower = 1 - rangePct;
            var pctUpper = rangePct;
            var color = {
                r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
                g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
                b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
            };
            return 'background-color: rgb(' + [color.r, color.g, color.b].join(',') + ')';
        };
        return {
            currentStateDescription: currentStateDescription,
            current: current,
            maxCapacity: maxCapacity,
            coloredPieces: coloredPieces,
            capacityLastFiveHours: capacityLastFiveHours,
            capacityHistory: capacityHistory,
            colorBlend: colorBlend
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