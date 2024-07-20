import { Injectable } from '@nestjs/common';
import { RashidCities } from './enum/rashid-cities.enum';

@Injectable()
export class RashidLocationService {
  getRashidLocation(): RashidCities | null {
    const today = new Date().getDay();
    switch (today) {
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