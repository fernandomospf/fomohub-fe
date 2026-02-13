import { ApiRequest, SupabaseTokenProvider } from "@/api/api";
import { MeasurementService } from "@/api/Measurement/measurements";
import { ProfileService } from "@/api/Profile/profiles";
import { WorkoutPlanService } from "@/api/WorkoutPlan/workout-plan";

const api = new ApiRequest(
  process.env.NEXT_PUBLIC_IRONHUB_API_URL || "http://localhost:8080",
  new SupabaseTokenProvider()
);

export const profileService = new ProfileService(api);
export const measurementService = new MeasurementService(api);
export const workoutPlanService = new WorkoutPlanService(api);
