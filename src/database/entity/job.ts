import { JobOptions } from 'bull';
import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';
import { BaseEntity } from './baseEntity';

export enum JobStatus {
    WAITING = 'waiting',
    ACTIVE = 'active',
    STALLED = 'stalled',
    COMPLETED = 'completed',
    FAILED = 'failed',
    RESUMED = 'resumed',
    REMOVED = 'removed',
    UNKNOWN = 'unknown'
}

@Entity({ name: 'Jobs' })
export class Job extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'uuid' })
    @Index({ unique: true })
    jobId!: string;

    @Column({
        type: 'enum',
        enum: JobStatus,
        default: JobStatus.UNKNOWN
    })
    jobStatus!: JobStatus;

    @Column()
    name!: string;

    @Column()
    queue!: string;

    @Column({
        nullable: true,
        type: 'jsonb'
    })
    options!: JobOptions;

    @Column('jsonb')
    data!: any;
}
