import { Injectable, BadRequestException } from '@nestjs/common';
import * as moment from 'moment-timezone';

@Injectable()
export class AuctionTimeService {
  calculateStartTime(): moment.Moment {
    const nowUTC = moment.utc();
    
    let startTimeUTC: moment.Moment;
    if (nowUTC.hour() < 9) {
      // Antes das 9:00 UTC, começar a auction no mesmo dia às 9:00 UTC
      startTimeUTC = moment.utc().startOf('day').hour(9);
    } else {
      // Após as 9:00 UTC, começar a auction no dia seguinte às 9:00 UTC
      startTimeUTC = moment.utc().startOf('day').add(1, 'day').hour(9);
    }

    return startTimeUTC;
  }

  validateEndTime(startTimeUTC: moment.Moment, endDateString: string): moment.Moment {
    const endDateUTC = moment.utc(endDateString, 'DD/MM/YYYY HH:mm');

    const hoursDifference = endDateUTC.diff(startTimeUTC, 'hours');
    if (hoursDifference < 24) {
      throw new BadRequestException('End time must be at least 24 hours after the start time.');
    }

    return endDateUTC;
  }

  getValidEndDates(startTimeUTC: moment.Moment): string[] {
    const validEndDates = [];
    for (let i = 24; i <= 168; i += 24) { // Oferece end times de 24 horas até 7 dias (168 horas)
      validEndDates.push(startTimeUTC.clone().add(i, 'hours').format('DD/MM/YYYY HH:mm'));
    }
    return validEndDates;
  }
}
