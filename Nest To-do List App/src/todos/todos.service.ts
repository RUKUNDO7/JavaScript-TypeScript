import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { UpdateTodoDto } from './dto/update-todo.dto';


@Injectable()
export class TodosService {
    constructor(
        @Inject('DATABASE_CONNECTION') 
        private db: Pool,
    ) {}

    async create(title: string) {
        const res = await this.db.query(
            'INSERT INTO todos(title, status) VALUES($1, $2) RETURNING *',
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

    async updateById(id: number, updateTodoDto: UpdateTodoDto) {
        const fields: string[] = [];
        const values: any[] = [];
        let index = 1;

        if (updateTodoDto.status !== undefined) {
            fields.push(`completed = $${index++}`);
            values.push(updateTodoDto.status);
        }

        if (updateTodoDto.title !== undefined) {
            fields.push(`title = $${index++}`);
            values.push(updateTodoDto.title); 
        }

        if (fields.length === 0) {
            throw new BadRequestException('There is nothing to update');
        }

        values.push(id);
        const query = `UPDATE todos SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`;

        const res = await this.db.query(query, values);

        if (res.rows.length === 0) {
            throw new NotFoundException(`Task with id ${id} not found`);
        }

        return res.rows[0];
    }

    async updateByTitle(title: string, updateTodoDto: UpdateTodoDto) {
        const fields: string[] = [];
        const values: any[] = [];
        let index = 1;

        if (updateTodoDto.status !== undefined) {
            fields.push(`completed = $${index++}`);
            values.push(updateTodoDto.status);
        }

        if (updateTodoDto.title !== undefined) {
            fields.push(`title = $${index++}`);
            values.push(updateTodoDto.title); 
        }

        if (fields.length === 0) {
            throw new BadRequestException('There is nothing to update');
        }

        values.push(title);
        const query = `UPDATE todos SET ${fields.join(', ')} WHERE title = $${index} RETURNING *`;

        const res = await this.db.query(query, values);

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
        const result = await this.db.query(
            'DELETE FROM todos WHERE title = $1 RETURNING *',
            [title]);
            if (result.rows.length === 0) {
                throw new NotFoundException(`Task with title ${title} not found`);
            }
    }
}

