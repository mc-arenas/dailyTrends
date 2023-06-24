const winston = require('winston');

export class Logger {

    private logger: any;
   
    constructor() {
      this.logger = winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        transports: [
          new winston.transports.File({ filename: 'info.log', level: 'info' })
        ],
      });
    }

    add(content: string){
        this.logger.log('info', content);
    }
}