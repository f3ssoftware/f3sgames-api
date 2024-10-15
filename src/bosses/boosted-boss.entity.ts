 /* istanbul ignore file */

import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('boosted_boss')
export class BoostedBoss {
  @Column({ type: 'text' })
  boostname: string;

  @PrimaryColumn({ type: 'varchar', length: 250 })
  date: string;

  @Column({ type: 'varchar', length: 250 })
  raceid: string;

  @Column({ type: 'int', default: 0 })
  looktypeEx: number;

  @Column({ type: 'int', default: 136 })
  looktype: number;

  @Column({ type: 'int', default: 0 })
  lookfeet: number;

  @Column({ type: 'int', default: 0 })
  looklegs: number;

  @Column({ type: 'int', default: 0 })
  lookhead: number;

  @Column({ type: 'int', default: 0 })
  lookbody: number;

  @Column({ type: 'int', default: 0 })
  lookaddons: number;

  @Column({ type: 'int', default: 0 })
  lookmount: number;
}
