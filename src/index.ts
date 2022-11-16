import * as dotenv from 'dotenv';
import {wsServerInit} from './ws/wsServer.js';
import {httpServerInit} from './http/httpServer.js';

dotenv.config();

httpServerInit(Number(process.env.PORT || 8080));
wsServerInit();