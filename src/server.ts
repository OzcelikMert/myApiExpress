import Express from 'express';
import InitConfig from "./config";
import chalk from "chalk";
let compression = require('compression');
import bodyParser  from "body-parser";
import cors from "cors";
import routers from "./routers";
import config from "config";
import responseTime from "response-time";

import "./library/variable/array"
import "./library/variable/string"
import "./library/variable/number"
import "./library/variable/date"
import "./library/variable/math"
import viewInitMiddleware from "./middlewares/init/view.init.middleware";
import sessionMiddleware from "./middlewares/validates/session.middleware";

const port = config.get("serverPort") as number;
const trafficMBLimit = config.get("serverTrafficMBLimit") as number || 2;
const whitelist = config.get("whiteList") as string[];

console.time(`server`)
console.log(chalk.cyan(`\n=========  SERVER LOADING =========`));

const app = Express();

new InitConfig(app).init().then(()=> {
    app.use(Express.json({limit: `${trafficMBLimit}mb`}));
    app.use(bodyParser.json({limit: `${trafficMBLimit}mb`}));
    app.use(bodyParser.urlencoded({limit: `${trafficMBLimit}mb`, extended: true, parameterLimit: 10000}));

    app.use(cors({
        origin: whitelist,
        methods: ['POST', 'PUT', 'GET', "DELETE", 'OPTIONS', 'HEAD'],
        credentials: true,
    }));

    app.use(responseTime());
    app.use(compression());
    app.use([viewInitMiddleware.set, sessionMiddleware.reload], routers);

    app.listen(port,() => {
        console.log(chalk.cyan(`=========  SERVER STARTED =========\n`));
        console.timeEnd(`server`);
    });
})


