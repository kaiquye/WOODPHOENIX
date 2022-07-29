import { inject, injectable } from 'tsyringe';
import AdapterUserRepository from '../../infra/adapters/AUserRepository';
import NewCollaboratorDto from '../../domain/dto/new-collaborator.dto';
import { Result } from '../../../../Shared/Error/App.error';
import UseCase from '../useCase';
import AuthAdmin from '../../infra/http/middleware/auth /auth.admin';

interface IResponse {}

@injectable()
class CreateUserUseCase implements UseCase<NewCollaboratorDto, IResponse> {
  private alreadyExists = 'there is already a registered user';
  constructor(
    @inject('UserRepository')
    private userRepository: AdapterUserRepository,
  ) {}
  async execute(newCollaboratorDto: NewCollaboratorDto): Promise<Result<any>> {
    try {
      const alreadyExists = await this.userRepository.exists(
        newCollaboratorDto,
      );

      if (alreadyExists) {
        return Result<NewCollaboratorDto>.fail(this.alreadyExists, 400);
      }

      await this.userRepository.create(newCollaboratorDto);
    } catch (error) {
      return Result<NewCollaboratorDto>.fail('unable to create a new admin');
    }
  }
}
export default CreateUserUseCase;
