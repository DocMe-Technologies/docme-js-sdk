export declare module TDocMeMeasurementV1 {
  export interface Data {
    hr_bpm: number;
    hrv_ms: number;
    rr_rpm: number;
    dbp_mmhg: number;
    sbp_mmhg: number;
    spO2_pct: number;
  }

  export interface Extra {
    age: string;
    sex: string;
    ethnicity: string;
  }

  export interface Details {
    ok: boolean;
    data: Data;
    extra: Extra;
    version: number;
  }

  export interface SuccessResponse {
    id: string;
    status: 'SUCCESS';
    details: Details;
  }

  export interface ProcessingResponse {
    id: string;
    status: 'PROCESSING';
  }

  export interface FailedResponse {
    id: string;
    status: 'ERROR';
    error_details: string;
  }
  export type Response = FailedResponse | ProcessingResponse | SuccessResponse;
}

export type DocMeConstructorOptions = {
  saveMeasurements?: boolean;
};
