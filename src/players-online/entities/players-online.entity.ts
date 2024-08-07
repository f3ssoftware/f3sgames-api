/* istanbul ignore file */
import { Player } from "../../players/player.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";

@Entity({ name: 'players_online' })
export class PlayersOnline {
  @PrimaryColumn()
  player_id: number;

  @OneToOne(() => Player, (player) => player.playersOnline)
  @JoinColumn({ name: 'player_id' })
  player: Player;

  @Column()
  online: boolean;
}
