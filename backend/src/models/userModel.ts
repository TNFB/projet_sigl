import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  nom?: string;

  @Column({ length: 100 })
  prenom?: string;

  @Column()
  date_naissance?: Date;

  @Column({ length: 10 })
  genre?: string;

  @Column({ length: 100 })
  mail?: string;

  @Column({ length: 100 })
  password?: string;

  @Column({ length: 15 })
  telephone?: string;

  @Column({ type: 'int', width: 1 })
  actif?: number;
}
