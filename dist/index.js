import * as dotenv from 'dotenv';
import { wsServerInit } from './ws/wsServer.js';
import { httpServerInit } from './http/httpServer.js';
dotenv.config();
const { PORT_WEBSOCKETS, PORT_HTTP } = process.env;
httpServerInit(Number(PORT_HTTP));
wsServerInit(Number(PORT_WEBSOCKETS));
