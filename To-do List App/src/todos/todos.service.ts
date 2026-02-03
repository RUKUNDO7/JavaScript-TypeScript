import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { NotFoundException } from '@nestjs/common';


@Injectable()
export class TodosService {
    constructor(
        @Inject('DATABASE_CONNECTION') 
        private db: Pool,
    ) {}

    async create(title: string) {
        const res = await this.db.query(
            'INSERT INTO todos(title, completed) VALUES($1, $2) RETURNING *',
            [title, false],
        );
        return res.rows[0];
    }

    async findAll() {
        const res = await this.db.query(
            'SELECT * FROM todos ORDER BY id ASC');
            if (res.rows.length === 0) {
                throw new NotFoundException('No tasks found');
            }
            return res.rows;
    }

    async findById(id: number) {
        const res = await this.db.query(
            'SELECT * FROM todos WHERE id = $1', [id]);
        if (res.rows.length === 0) {
            throw new NotFoundException(`Task with id ${id} not found`);
        }
        return res.rows[0];
    }

    async findByTitle(title: string) {
        const res = await this.db.query(
            'SELECT * FROM todos WHERE title = $1', [title]);
        if (res.rows.length === 0) {
            throw new NotFoundException(`Task with title ${title} not found`);
        }
        return res.rows[0];
    }

    async updateById(id: number, completed: boolean) {
        const res = await this.db.query(
        'UPDATE todos SET completed = $1 WHERE id = $2 RETURNING *',
        [completed, id],
        );
        if (res.rows.length === 0) {
            throw new NotFoundException(`Task with id ${id} not found`);
        }
        return res.rows[0];
    }

    async updateByTitle(title: string, completed: boolean) {
        const res = await this.db.query(
            'UPDATE todos SET completed = $1 WHERE title = $2 RETURNING *', 
            [completed, title]);
        if (res.rows.length === 0) {
            throw new NotFoundException(`Task with title ${title} not found`);
        }
        return res.rows[0];
    }

    async deleteById(id: number) {
        const res = await this.db.query(
            'DELETE FROM todos WHERE id = $1 RETURNING *', [id]);
            if (res.rows.length === 0) { 
                throw new NotFoundException(`Task with id ${id} not found`);
            }
            return res.rows[0];
    }

    async deleteByTitle(title: string) {
        const res = await this.db.query(
            'DELETE FROM todos WHERE title = $1 RETURNING *',
            [title]);
            if (res.rows.length === 0) {
                throw new NotFoundException(`Task with title ${title} not found`);
            }
            return res.rows[0];
    }
}

