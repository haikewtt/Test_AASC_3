import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('TasksController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST /tasks - tạo task mới', () => {
    return request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'E2E Test Task' })
      .expect(201)
      .expect((res) => {
        expect(res.body.title).toBe('E2E Test Task');
        expect(res.body.id).toBeDefined();
      });
  });

  it('POST /tasks - reject empty title', () => {
    return request(app.getHttpServer())
      .post('/tasks')
      .send({ title: '' })
      .expect(400);
  });

  it('GET /tasks - lấy danh sách', () => {
    return request(app.getHttpServer()).get('/tasks').expect(200);
  });
});
