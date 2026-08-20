import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from '../dto/create-task.dto';
import { TaskStatus } from '../enums/task-status.enum';
import { Task } from '../entities/task.entity';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;
  let repository: jest.Mocked<Repository<Task>>;

  const mockTask: Task = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    title: 'Test Task',
    description: 'Mô tả test',
    status: TaskStatus.TODO,
    createdAt: new Date('2026-01-01'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get(getRepositoryToken(Task));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a new task', async () => {
      const dto: CreateTaskDto = { title: 'Test Task' };
      repository.create.mockReturnValue(mockTask);
      repository.save.mockResolvedValue(mockTask);

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith({
        title: 'Test Task',
        status: TaskStatus.TODO,
        description: '',
      });
      expect(result).toEqual(mockTask);
    });
  });

  describe('findOne', () => {
    it('should return a task when found', async () => {
      repository.findOne.mockResolvedValue(mockTask);

      const result = await service.findOne(mockTask.id);

      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException when task not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove an existing task', async () => {
      repository.findOne.mockResolvedValue(mockTask);
      repository.remove.mockResolvedValue(mockTask);

      await service.remove(mockTask.id);

      expect(repository.remove).toHaveBeenCalledWith(mockTask);
    });
  });
});
