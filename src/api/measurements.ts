import { supabase } from '../lib/supabase';
import { Measurements } from '../types/user';

const rawApiBase = process.env.NEXT_PUBLIC_IRONHUB_API_URL || 'http://localhost:3003';
const API_BASE = rawApiBase.replace(/\/$/, '');

export class MeasurementService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE) {
    this.baseUrl = baseUrl;
  }

  private async getToken(): Promise<string | null> {
    try {
      const { data } = await supabase.auth.getSession();
      return data?.session?.access_token ?? null;
    } catch (err) {
      console.error('MeasurementService.getToken error', err);
      return null;
    }
  }

  public async update(payload: Partial<Measurements>): Promise<Measurements> {
    const token = await this.getToken();

    if (!token) {
      throw new Error('Usuário não autenticado');
    }

    const url = `${this.baseUrl}/profiles/update/measurements`;

    try {
      const res = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.text();
        throw new Error(
          `Request to ${url} failed: ${res.status} ${res.statusText} - ${body}`,
        );
      }

      const text = await res.text();
      if (!text) {
        return {} as Measurements;
      }

      return JSON.parse(text) as Measurements;
    } catch (err: any) {
      console.error('MeasurementService.update error', err);
      throw new Error(
        `Network request failed to ${url}: ${err?.message ?? String(err)}`,
      );
    }
  }
}

export const measurementService = new MeasurementService();
export default measurementService;
