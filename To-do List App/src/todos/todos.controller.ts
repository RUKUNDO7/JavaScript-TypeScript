import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('todos')
export class TodosController {
    constructor(private readonly todosService: TodosService) {}

        @Post()
        create(@Body() createTodoDto: CreateTodoDto) {
            return this.todosService.create(createTodoDto.title);
        }

        @Get()
        findAll() {
            return this.todosService.findAll();
        }

        @Put()
        update(@Param('id') id: number, @Body() updateTodoDto: UpdateTodoDto) {
            return this.todosService.update(id, updateTodoDto.completed);
        }

        @Delete(':id')
        remove(@Param('id') id: number) {
            return this.todosService.delete(id);
        }
    }
