import { CreateDateColumn, Index, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
    @Index()
    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt!: Date;

    @Index()
    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt!: Date;
}
