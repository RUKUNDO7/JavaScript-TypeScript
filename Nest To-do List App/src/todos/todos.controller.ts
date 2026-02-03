import { Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe } from '@nestjs/common';
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

        @Get('id/:id') 
        getTodoById(@Param('id', ParseIntPipe) id: number) {
            return this.todosService.findById(id);
        }

        @Get('title/:title')
        getTodoByTitle(@Param('title') title: string) {
            return this.todosService.findByTitle(title);
        }

        @Put('id/:id')
        update(
            @Param('id', ParseIntPipe) id: number, 
            @Body() updateTodoDto: UpdateTodoDto) {
            return this.todosService.updateById(id, updateTodoDto);
        }

        @Put('title/:title')
        updateByTitle(
            @Param('title') title: string,
            @Body() updateTodoDto: UpdateTodoDto
        ) {
            return this.todosService.updateByTitle(title, updateTodoDto);
        }

        @Delete('id/:id')
        remove(@Param('id') id: number) {
            return this.todosService.deleteById(id);
        }

        @Delete('title/:title')
        deleteByTitle(@Param('title') title: string) {
            return this.todosService.deleteByTitle(title);
        }
    }
