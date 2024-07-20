import { Injectable } from '@nestjs/common';
import { RashidCities } from './enum/rashid-cities.enum';

@Injectable()
export class RashidLocationService {
  getRashidLocation(): RashidCities | null {
    const now = new Date();
    const brasiliaOffset = -3; // Horário de Brasília (UTC-3)
    const hour = now.getUTCHours() + brasiliaOffset;

    let day = now.getUTCDay();

    if (hour < 6) {
      day = (day === 0) ? 6 : day - 1; /* Thing is... this NPC in game changes his city at the server save of the game,
                                          which happens at 6 AM o'clock in Brasília, Brazil hour. */
    }

    switch (day) {
      case 0:
        return RashidCities.CARLIN; // Sunday
      case 1:
        return RashidCities.SVARGROND; // Monday
      case 2:
        return RashidCities.LIBERTY_BAY; // Tuesday
      case 3:
        return RashidCities.PORT_HOPE; // Wednesday
      case 4:
        return RashidCities.ANKRAHMUN; // Thursday
      case 5:
        return RashidCities.DARASHIA; // Friday
      case 6:
        return RashidCities.EDRON; // Saturday
      default:
        return null;
    }
  }
}
