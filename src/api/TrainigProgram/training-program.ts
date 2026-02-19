import { ApiRequest } from '../api';
import { GenerateProgramPayload, TrainingProgramResponse } from './types';

export class TrainingProgramService {
  constructor(private api: ApiRequest) {}

  public async generateProgram(
    payload: GenerateProgramPayload,
  ): Promise<{ programId: string }> {
    return this.api.post<{ programId: string }>(
      'training-programs/generate',
      payload,
    );
  }

  public async getProgram(
    programId: string,
  ): Promise<TrainingProgramResponse> {
    return this.api.get<TrainingProgramResponse>(
      `training-programs/${programId}`,
    );
  }

  public async listMyPrograms(): Promise<
    { id: string; name: string; totalWeeks: number }[]
  > {
    return this.api.get<
      { id: string; name: string; totalWeeks: number }[]
    >('training-programs');
  }
}
