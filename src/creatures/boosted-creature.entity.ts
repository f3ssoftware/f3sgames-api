 /* istanbul ignore file */

import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('boosted_creature')
export class BoostedCreature {
  @Column('text')
  boostname: string;

  @PrimaryColumn('varchar', { length: 250 })
  date: string;

  @Column('varchar', { length: 250 })
  raceid: string;

  @Column('int', { default: 136 })
  looktype: number;

  @Column('int', { default: 0 })
  lookfeet: number;

  @Column('int', { default: 0 })
  looklegs: number;

  @Column('int', { default: 0 })
  lookhead: number;

  @Column('int', { default: 0 })
  lookbody: number;

  @Column('int', { default: 0 })
  lookaddons: number;

  @Column('int', { default: 0 })
  lookmount: number;
}
