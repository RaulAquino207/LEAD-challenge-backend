import {
    BaseEntity,
    Entity,
    Unique,
    PrimaryGeneratedColumn,
    Column,
  } from 'typeorm';
import { TagDto } from './dto/tag-user.dto';
  
  @Entity()
  @Unique(['email'])
  export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({type: 'enum', enum: TagDto, default: TagDto.DEFAULT})
    tag: TagDto;
    
    @Column({ nullable: false, type: 'varchar', length: 200 })
    email: string;

    @Column({ nullable: false, type: 'varchar', length: 200 })
    name: string;
  
    @Column({ nullable: true })
    description: number;
  
    @Column({ nullable: false, default: true })
    status: boolean;

    @Column({ nullable: false, default: true })
    email_send: boolean;

    @Column({ nullable: false, type: 'varchar', length: 200 })
    password: string;
  }