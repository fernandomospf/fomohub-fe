import { Measurements } from "@/types/user";
import { ApiRequest } from "../api";

export class MeasurementService {
  constructor(private api: ApiRequest) {}

  async update(payload: Partial<Measurements>): Promise<Measurements> {
    return this.api.patch<Measurements>(
      "profiles/update/measurements",
      payload
    );
  }
}
