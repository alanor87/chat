import { wsServerInit } from "./ws/wsServer.js";
import { httpServerInit } from "./http/httpServer.js";

httpServerInit();
wsServerInit();
