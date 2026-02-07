import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({
        type: 'varchar',
        length: 255,
        unique: true,
    })
    email!: string

    @Column({
        type: 'text',
    })
    password!: string

    @CreateDateColumn({
        type: 'timestamptz',
    })
    createdAt!: Date

    @UpdateDateColumn({
        type: 'timestamptz',
    })
    updatedAt!: Date
}