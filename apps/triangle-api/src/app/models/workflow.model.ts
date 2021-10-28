import { Column, PrimaryGeneratedColumn, Table } from '@gradii/fedaco';

@Table()
export class WorkflowModel {
  @PrimaryGeneratedColumn()
  id;

  @Column()
  name: string;
}