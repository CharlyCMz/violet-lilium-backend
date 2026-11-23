import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET / rejects unauthenticated requests with 401', () => {
    return request(app.getHttpServer()).get('/').expect(401);
  });

  it('GET /product-variants is a public route and returns 200', () => {
    return request(app.getHttpServer()).get('/product-variants').expect(200);
  });
});
