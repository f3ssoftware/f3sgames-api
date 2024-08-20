/* istanbul ignore file */
import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { Player } from '../../players/player.entity';

@Entity({ name: 'player_namelocks' })
export class PlayerNamelock {
  @PrimaryColumn({ name: 'player_id', type: 'int' })
  playerId: number;

  @OneToOne(() => Player, (player) => player.namelock)
  @JoinColumn({ name: 'player_id' })
  player: Player;

  @Column({ type: 'varchar', length: 255 })
  reason: string;

  @Column({ name: 'namelocked_at', type: 'bigint' })
  namelockedAt: number;

  @Column({ name: 'namelocked_by', type: 'int' })
  namelockedBy: number;
}
