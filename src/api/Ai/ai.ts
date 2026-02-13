import { ApiRequest } from "../api";
import { GeneratedWorkoutResponse, GenerateWorkoutRequest, RemainingCreditsResponse } from "./types";

export class AiService {
    constructor(private api: ApiRequest) { }

    public async generateWorkoutPlan(request: GenerateWorkoutRequest): Promise<GeneratedWorkoutResponse> {
        return this.api.post<GeneratedWorkoutResponse>("ai/generate-workout", request);
    }

    public async remainingCredits(): Promise<RemainingCreditsResponse> {
        return this.api.get<RemainingCreditsResponse>("ai/remaining-credit");
    }
}
