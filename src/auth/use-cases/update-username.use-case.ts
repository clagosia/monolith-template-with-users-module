import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { UpdateUsernameDto } from '../dto/update-username.dto';
import { HandleErrors } from '../../common/decorators/handle-errors.decorator';
import { UserNotFoundError, UsernameConflictError } from '../../common/errors';

@Injectable()
export class UpdateUsernameUseCase {
  constructor(private readonly usersService: UsersService) {}

  @HandleErrors([UserNotFoundError, UsernameConflictError])
  async execute(userId: string, updateUsernameDto: UpdateUsernameDto) {
    await this.usersService.findOne(userId);

    const existing = await this.usersService.findByUsername(
      updateUsernameDto.newUsername,
    );
    if (existing && existing.id !== userId) {
      throw new UsernameConflictError();
    }

    await this.usersService.update(userId, {
      username: updateUsernameDto.newUsername,
    });

    return { message: 'Username updated successfully' };
  }
}
