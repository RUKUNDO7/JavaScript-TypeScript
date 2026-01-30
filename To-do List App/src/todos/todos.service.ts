import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';


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
        const res = await this.db.query('SELECT * FROM todos ORDER BY id ASC');
        return res.rows;
    }

    async update(id: number, completed: boolean) {
        const res = await this.db.query(
        'UPDATE todos SET completed = $1 WHERE id = $2 RETURNING *',
        [completed, id],
        );
        return res.rows[0];
    }

    async delete(id: number) {
        const res = await this.db.query('DELETE FROM todos WHERE id = $1 RETURNING *', [id]);
        return res.rows[0]
    }
}

