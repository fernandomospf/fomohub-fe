import { ApiRequest } from "../api";
import { GenerateWorkoutRequest, GenerateWorkoutResponse } from "./types";

export class AiService {
    constructor(private api: ApiRequest) { }

    public async generateWorkoutPlan(request: GenerateWorkoutRequest): Promise<GenerateWorkoutResponse> {
        return this.api.post<GenerateWorkoutResponse>("/ai/generate-workout", request);
    }
}
