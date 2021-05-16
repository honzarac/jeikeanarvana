"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const path_1 = require("path");
const onca_1 = require("onca");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useStaticAssets(path_1.join(__dirname, '..', 'public'));
    app.setBaseViewsDir(path_1.join(__dirname, '..', 'views'));
    app.setViewEngine('art');
    app.engine('art', onca_1.expressEngine);
    app.set('view options', { debug: process.env.NODE_ENV !== 'production' });
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map