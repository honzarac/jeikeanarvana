"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const typeorm_1 = require("@nestjs/typeorm");
const watcher_controller_1 = require("./watcher.controller");
const capacitylog_entity_1 = require("./CapacityLog/capacitylog.entity");
const ikeacapacity_service_1 = require("./CapacityLog/ikeacapacity.service");
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: 'db',
                port: 5432,
                username: 'ikea',
                password: 'pass',
                database: 'ikea-dev',
                entities: [capacitylog_entity_1.CapacityLog],
                synchronize: true,
            }),
            common_1.HttpModule.register({
                timeout: 5000,
                maxRedirects: 5,
            }),
        ],
        controllers: [app_controller_1.AppController, watcher_controller_1.WatcherController],
        providers: [app_service_1.AppService, ikeacapacity_service_1.IkeaCapacityService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map