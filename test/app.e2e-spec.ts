/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from '../src/users/users.module';
import { AuthModule } from '../src/auth/auth.module';
import { JwtAuthGuard } from '../src/common/guards';
import { databaseConfig, jwtConfig } from '../src/config';
import { User } from '../src/users/entities/user.entity';
import { UserCredential } from '../src/auth/entities/user-credential.entity';
import { Role } from '../src/auth/access-control/entities/role.entity';
import { Permission } from '../src/auth/access-control/entities/permission.entity';
import { Action } from '../src/auth/access-control/entities/action.entity';
import { Source } from '../src/auth/access-control/entities/source.entity';
import { UserRole } from '../src/auth/access-control/entities/user-role.entity';

describe('Application E2E Tests', () => {
  let app: INestApplication<App>;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [databaseConfig, jwtConfig],
        }),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [
            User,
            UserCredential,
            Role,
            Permission,
            Action,
            Source,
            UserRole,
          ],
          synchronize: true,
          dropSchema: true,
        }),
        UsersModule,
        AuthModule,
      ],
      providers: [
        {
          provide: APP_GUARD,
          useClass: JwtAuthGuard,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // ─── Auth Endpoints ──────────────────────────────────────

  describe('Auth Module', () => {
    describe('POST /auth/register', () => {
      it('should register a new user', () => {
        return request(app.getHttpServer())
          .post('/auth/register')
          .send({
            username: 'testuser',
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            phone: '+1234567890',
            password: 'password123',
          })
          .expect(201)
          .expect((res) => {
            expect(res.body).toHaveProperty('accessToken');
            expect(res.body).toHaveProperty('user');
            expect(res.body.user).toHaveProperty('id');
            expect(res.body.user.username).toBe('testuser');
            authToken = res.body.accessToken;
          });
      });

      it('should fail with duplicate username', () => {
        return request(app.getHttpServer())
          .post('/auth/register')
          .send({
            username: 'testuser',
            firstName: 'Test2',
            lastName: 'User2',
            email: 'test2@example.com',
            password: 'password123',
          })
          .expect(409);
      });

      it('should fail with invalid email', () => {
        return request(app.getHttpServer())
          .post('/auth/register')
          .send({
            username: 'newuser',
            firstName: 'New',
            lastName: 'User',
            email: 'invalid-email',
            password: 'password123',
          })
          .expect(400);
      });

      it('should fail with short password', () => {
        return request(app.getHttpServer())
          .post('/auth/register')
          .send({
            username: 'newuser2',
            firstName: 'New',
            lastName: 'User',
            email: 'new2@example.com',
            password: 'short',
          })
          .expect(400);
      });
    });

    describe('POST /auth/login', () => {
      it('should login with valid credentials', () => {
        return request(app.getHttpServer())
          .post('/auth/login')
          .send({
            username: 'testuser',
            password: 'password123',
          })
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('accessToken');
            expect(res.body).toHaveProperty('user');
            authToken = res.body.accessToken;
          });
      });

      it('should fail with invalid password', () => {
        return request(app.getHttpServer())
          .post('/auth/login')
          .send({
            username: 'testuser',
            password: 'wrongpassword',
          })
          .expect(401);
      });

      it('should fail with non-existent user', () => {
        return request(app.getHttpServer())
          .post('/auth/login')
          .send({
            username: 'nonexistent',
            password: 'password123',
          })
          .expect(401);
      });
    });

    describe('PATCH /auth/password', () => {
      it('should update password with valid token', () => {
        return request(app.getHttpServer())
          .patch('/auth/password')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            currentPassword: 'password123',
            newPassword: 'newpassword123',
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.message).toBe('Password updated successfully');
          });
      });

      it('should fail without auth token', () => {
        return request(app.getHttpServer())
          .patch('/auth/password')
          .send({
            currentPassword: 'newpassword123',
            newPassword: 'anotherpassword',
          })
          .expect(401);
      });
    });

    describe('PATCH /auth/username', () => {
      it('should update username with valid token', () => {
        return request(app.getHttpServer())
          .patch('/auth/username')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            newUsername: 'updateduser',
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.message).toBe('Username updated successfully');
          });
      });
    });

    describe('POST /auth/password-recovery', () => {
      it('should return success message for password recovery', () => {
        return request(app.getHttpServer())
          .post('/auth/password-recovery')
          .send({
            email: 'test@example.com',
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.message).toContain(
              'If an account with that email exists',
            );
          });
      });

      it('should return success even for non-existent email', () => {
        return request(app.getHttpServer())
          .post('/auth/password-recovery')
          .send({
            email: 'nonexistent@example.com',
          })
          .expect(200);
      });
    });
  });

  // ─── Users Endpoints ─────────────────────────────────────

  describe('Users Module', () => {
    let userId: string;

    describe('GET /users', () => {
      it('should return all users with auth token', () => {
        return request(app.getHttpServer())
          .get('/users')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
          .expect((res) => {
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
            userId = res.body[0].id;
          });
      });

      it('should fail without auth token', () => {
        return request(app.getHttpServer()).get('/users').expect(401);
      });
    });

    describe('GET /users/:id', () => {
      it('should return a user by id', () => {
        return request(app.getHttpServer())
          .get(`/users/${userId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('id', userId);
            expect(res.body).toHaveProperty('username');
            expect(res.body).toHaveProperty('firstName');
            expect(res.body).toHaveProperty('lastName');
            expect(res.body).toHaveProperty('email');
          });
      });

      it('should return 404 for non-existent user', () => {
        return request(app.getHttpServer())
          .get('/users/550e8400-e29b-41d4-a716-446655440099')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(404);
      });
    });

    describe('PATCH /users/:id', () => {
      it('should update a user', () => {
        return request(app.getHttpServer())
          .patch(`/users/${userId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({ firstName: 'Updated' })
          .expect(200)
          .expect((res) => {
            expect(res.body.firstName).toBe('Updated');
          });
      });
    });
  });

  // ─── Access Control Endpoints ────────────────────────────

  describe('Access Control Module', () => {
    let roleId: string;
    let permissionId: string;
    let actionId: string;
    let sourceId: string;
    let userId: string;

    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${authToken}`);
      userId = res.body[0].id;
    });

    describe('POST /access-control/roles', () => {
      it('should create a role', () => {
        return request(app.getHttpServer())
          .post('/access-control/roles')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ name: 'admin', description: 'Administrator role' })
          .expect(201)
          .expect((res) => {
            expect(res.body).toHaveProperty('id');
            expect(res.body.name).toBe('admin');
            roleId = res.body.id;
          });
      });

      it('should fail with duplicate role name', () => {
        return request(app.getHttpServer())
          .post('/access-control/roles')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ name: 'admin' })
          .expect(409);
      });
    });

    describe('GET /access-control/roles', () => {
      it('should return all roles', () => {
        return request(app.getHttpServer())
          .get('/access-control/roles')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
          .expect((res) => {
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
          });
      });
    });

    describe('GET /access-control/roles/:id', () => {
      it('should return a role by id', () => {
        return request(app.getHttpServer())
          .get(`/access-control/roles/${roleId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.id).toBe(roleId);
            expect(res.body.name).toBe('admin');
          });
      });
    });

    describe('PATCH /access-control/roles/:id', () => {
      it('should update a role', () => {
        return request(app.getHttpServer())
          .patch(`/access-control/roles/${roleId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({ description: 'Updated admin description' })
          .expect(200)
          .expect((res) => {
            expect(res.body.description).toBe('Updated admin description');
          });
      });
    });

    describe('POST /access-control/permissions', () => {
      it('should create a permission', () => {
        return request(app.getHttpServer())
          .post('/access-control/permissions')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ name: 'manage_users', description: 'Manage users' })
          .expect(201)
          .expect((res) => {
            expect(res.body).toHaveProperty('id');
            expect(res.body.name).toBe('manage_users');
            permissionId = res.body.id;
          });
      });
    });

    describe('GET /access-control/permissions', () => {
      it('should return all permissions', () => {
        return request(app.getHttpServer())
          .get('/access-control/permissions')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
          .expect((res) => {
            expect(Array.isArray(res.body)).toBe(true);
          });
      });
    });

    describe('POST /access-control/actions', () => {
      it('should create an action', () => {
        return request(app.getHttpServer())
          .post('/access-control/actions')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ name: 'CREATE', description: 'Create action' })
          .expect(201)
          .expect((res) => {
            expect(res.body).toHaveProperty('id');
            expect(res.body.name).toBe('CREATE');
            actionId = res.body.id;
          });
      });
    });

    describe('GET /access-control/actions', () => {
      it('should return all actions', () => {
        return request(app.getHttpServer())
          .get('/access-control/actions')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
          .expect((res) => {
            expect(Array.isArray(res.body)).toBe(true);
          });
      });
    });

    describe('POST /access-control/sources', () => {
      it('should create a source', () => {
        return request(app.getHttpServer())
          .post('/access-control/sources')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ name: 'users', description: 'Users resource' })
          .expect(201)
          .expect((res) => {
            expect(res.body).toHaveProperty('id');
            expect(res.body.name).toBe('users');
            sourceId = res.body.id;
          });
      });
    });

    describe('GET /access-control/sources', () => {
      it('should return all sources', () => {
        return request(app.getHttpServer())
          .get('/access-control/sources')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
          .expect((res) => {
            expect(Array.isArray(res.body)).toBe(true);
          });
      });
    });

    describe('User-Role associations', () => {
      it('should assign a role to a user', () => {
        return request(app.getHttpServer())
          .post('/access-control/user-roles')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ userId, roleId })
          .expect(201)
          .expect((res) => {
            expect(res.body).toHaveProperty('userId', userId);
            expect(res.body).toHaveProperty('roleId', roleId);
          });
      });

      it('should fail assigning duplicate user-role', () => {
        return request(app.getHttpServer())
          .post('/access-control/user-roles')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ userId, roleId })
          .expect(409);
      });

      it('should get user roles', () => {
        return request(app.getHttpServer())
          .get(`/access-control/user-roles/${userId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
          .expect((res) => {
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
          });
      });
    });

    describe('Role-Permission associations', () => {
      it('should assign a permission to a role', () => {
        return request(app.getHttpServer())
          .post('/access-control/role-permissions')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ roleId, permissionId })
          .expect(201)
          .expect((res) => {
            expect(res.body.permissions).toBeDefined();
          });
      });

      it('should fail assigning duplicate role-permission', () => {
        return request(app.getHttpServer())
          .post('/access-control/role-permissions')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ roleId, permissionId })
          .expect(409);
      });
    });

    describe('Permission-Action associations', () => {
      it('should assign an action to a permission', () => {
        return request(app.getHttpServer())
          .post('/access-control/permission-actions')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ permissionId, actionId })
          .expect(201)
          .expect((res) => {
            expect(res.body.actions).toBeDefined();
          });
      });
    });

    describe('Permission-Source associations', () => {
      it('should assign a source to a permission', () => {
        return request(app.getHttpServer())
          .post('/access-control/permission-sources')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ permissionId, sourceId })
          .expect(201)
          .expect((res) => {
            expect(res.body.sources).toBeDefined();
          });
      });
    });

    describe('Cleanup', () => {
      it('should remove permission-source association', () => {
        return request(app.getHttpServer())
          .delete(
            `/access-control/permission-sources/${permissionId}/${sourceId}`,
          )
          .set('Authorization', `Bearer ${authToken}`)
          .expect(204);
      });

      it('should remove permission-action association', () => {
        return request(app.getHttpServer())
          .delete(
            `/access-control/permission-actions/${permissionId}/${actionId}`,
          )
          .set('Authorization', `Bearer ${authToken}`)
          .expect(204);
      });

      it('should remove role-permission association', () => {
        return request(app.getHttpServer())
          .delete(`/access-control/role-permissions/${roleId}/${permissionId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(204);
      });

      it('should remove user-role association', () => {
        return request(app.getHttpServer())
          .delete(`/access-control/user-roles/${userId}/${roleId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(204);
      });

      it('should delete a source', () => {
        return request(app.getHttpServer())
          .delete(`/access-control/sources/${sourceId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(204);
      });

      it('should delete an action', () => {
        return request(app.getHttpServer())
          .delete(`/access-control/actions/${actionId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(204);
      });

      it('should delete a permission', () => {
        return request(app.getHttpServer())
          .delete(`/access-control/permissions/${permissionId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(204);
      });

      it('should delete a role', () => {
        return request(app.getHttpServer())
          .delete(`/access-control/roles/${roleId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(204);
      });
    });
  });

  // ─── Auth Delete Endpoints ───────────────────────────────

  describe('Auth Credential Management', () => {
    let testUserId: string;

    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          username: 'deleteuser',
          firstName: 'Delete',
          lastName: 'User',
          email: 'delete@example.com',
          password: 'password123',
        });
      testUserId = res.body.user.id;
    });

    it('should soft delete user credentials', () => {
      return request(app.getHttpServer())
        .delete(`/auth/${testUserId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.message).toContain('soft deleted');
        });
    });

    it('should hard delete user credentials', () => {
      return request(app.getHttpServer())
        .delete(`/auth/${testUserId}/permanent`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.message).toContain('permanently deleted');
        });
    });
  });
});
