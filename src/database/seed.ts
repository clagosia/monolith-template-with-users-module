import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { UserCredential } from '../auth/entities/user-credential.entity';
import { Role } from '../auth/access-control/entities/role.entity';
import { Permission } from '../auth/access-control/entities/permission.entity';
import { Action } from '../auth/access-control/entities/action.entity';
import { Source } from '../auth/access-control/entities/source.entity';
import { UserRole } from '../auth/access-control/entities/user-role.entity';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  const userRepo = dataSource.getRepository(User);
  const credentialRepo = dataSource.getRepository(UserCredential);
  const roleRepo = dataSource.getRepository(Role);
  const permissionRepo = dataSource.getRepository(Permission);
  const actionRepo = dataSource.getRepository(Action);
  const sourceRepo = dataSource.getRepository(Source);
  const userRoleRepo = dataSource.getRepository(UserRole);

  console.log('Seeding database...\n');

  // ── Actions ──────────────────────────────────────────────
  const actionNames = ['CREATE', 'READ', 'UPDATE', 'DELETE'];
  const actions: Action[] = [];
  for (const name of actionNames) {
    const existing = await actionRepo.findOne({ where: { name } });
    if (!existing) {
      const action = actionRepo.create({
        name,
        description: `${name} action`,
      });
      actions.push(await actionRepo.save(action));
      console.log(`  Created action: ${name}`);
    } else {
      actions.push(existing);
      console.log(`  Action already exists: ${name}`);
    }
  }

  // ── Sources ──────────────────────────────────────────────
  const sourceNames = ['users', 'roles', 'permissions', 'reports', 'settings'];
  const sources: Source[] = [];
  for (const name of sourceNames) {
    const existing = await sourceRepo.findOne({ where: { name } });
    if (!existing) {
      const source = sourceRepo.create({
        name,
        description: `${name} resource`,
      });
      sources.push(await sourceRepo.save(source));
      console.log(`  Created source: ${name}`);
    } else {
      sources.push(existing);
      console.log(`  Source already exists: ${name}`);
    }
  }

  // ── Permissions ──────────────────────────────────────────
  const permissionDefs = [
    {
      name: 'manage_users',
      description: 'Full access to user management',
      actions: actions,
      sources: [sources[0]],
    },
    {
      name: 'manage_roles',
      description: 'Full access to role management',
      actions: actions,
      sources: [sources[1]],
    },
    {
      name: 'view_reports',
      description: 'Read-only access to reports',
      actions: [actions[1]],
      sources: [sources[3]],
    },
    {
      name: 'manage_settings',
      description: 'Full access to system settings',
      actions: actions,
      sources: [sources[4]],
    },
    {
      name: 'view_users',
      description: 'Read-only access to users',
      actions: [actions[1]],
      sources: [sources[0]],
    },
  ];

  const permissions: Permission[] = [];
  for (const def of permissionDefs) {
    let perm = await permissionRepo.findOne({
      where: { name: def.name },
      relations: ['actions', 'sources'],
    });
    if (!perm) {
      perm = permissionRepo.create({
        name: def.name,
        description: def.description,
        actions: def.actions,
        sources: def.sources,
      });
      perm = await permissionRepo.save(perm);
      console.log(`  Created permission: ${def.name}`);
    } else {
      console.log(`  Permission already exists: ${def.name}`);
    }
    permissions.push(perm);
  }

  // ── Roles ────────────────────────────────────────────────
  const roleDefs = [
    {
      name: 'admin',
      description: 'Full system access',
      permissions: [
        permissions[0],
        permissions[1],
        permissions[2],
        permissions[3],
      ],
    },
    {
      name: 'manager',
      description: 'User and report management',
      permissions: [permissions[0], permissions[2]],
    },
    {
      name: 'viewer',
      description: 'Read-only access',
      permissions: [permissions[2], permissions[4]],
    },
  ];

  const roles: Role[] = [];
  for (const def of roleDefs) {
    let role = await roleRepo.findOne({
      where: { name: def.name },
      relations: ['permissions'],
    });
    if (!role) {
      role = roleRepo.create({
        name: def.name,
        description: def.description,
        permissions: def.permissions,
      });
      role = await roleRepo.save(role);
      console.log(`  Created role: ${def.name}`);
    } else {
      console.log(`  Role already exists: ${def.name}`);
    }
    roles.push(role);
  }

  // ── Users + Credentials ──────────────────────────────────
  const salt = await bcrypt.genSalt(10);
  const defaultPasswordHash = await bcrypt.hash('password123', salt);

  const userDefs = [
    {
      username: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      phone: '+1000000001',
      role: roles[0],
    },
    {
      username: 'manager',
      firstName: 'Manager',
      lastName: 'User',
      email: 'manager@example.com',
      phone: '+1000000002',
      role: roles[1],
    },
    {
      username: 'viewer',
      firstName: 'Viewer',
      lastName: 'User',
      email: 'viewer@example.com',
      phone: '+1000000003',
      role: roles[2],
    },
  ];

  for (const def of userDefs) {
    let user = await userRepo.findOne({ where: { username: def.username } });
    if (!user) {
      user = userRepo.create({
        username: def.username,
        firstName: def.firstName,
        lastName: def.lastName,
        email: def.email,
        phone: def.phone,
      });
      user = await userRepo.save(user);

      const credential = credentialRepo.create({
        userId: user.id,
        passwordHash: defaultPasswordHash,
        providerType: 'local',
      });
      await credentialRepo.save(credential);

      const userRole = userRoleRepo.create({
        userId: user.id,
        roleId: def.role.id,
      });
      await userRoleRepo.save(userRole);

      console.log(`  Created user: ${def.username} (role: ${def.role.name})`);
    } else {
      console.log(`  User already exists: ${def.username}`);
    }
  }

  console.log('\n--- Seed Summary ---');
  console.log(`Actions:     ${(await actionRepo.find()).length}`);
  console.log(`Sources:     ${(await sourceRepo.find()).length}`);
  console.log(`Permissions: ${(await permissionRepo.find()).length}`);
  console.log(`Roles:       ${(await roleRepo.find()).length}`);
  console.log(`Users:       ${(await userRepo.find()).length}`);
  console.log(`User-Roles:  ${(await userRoleRepo.find()).length}`);

  console.log('\n--- Default Credentials ---');
  console.log('All seeded users have password: password123');
  console.log('  admin    / password123  (role: admin)');
  console.log('  manager  / password123  (role: manager)');
  console.log('  viewer   / password123  (role: viewer)');

  await app.close();
  console.log('\nSeed complete!');
}

void seed();
