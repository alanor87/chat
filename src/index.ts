import {wsServerInit} from './ws/wsServer.js';
import {httpServerInit} from './http/httpServer.js';

httpServerInit(Number(process.env.PORT || 8080));
wsServerInit(Number(process.env.PORT || 8081));