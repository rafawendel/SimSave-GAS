export as namespace SimSave;

// Utils
export function stringifyQuery(queryParams: object): string;

// HTTP requests
export function fetchUrl(reqUrl: string, params: object): Promise<any>;

export function batchFetch(reqUrlList: string[], params: object): {
  responses: any[],
  errors: any[]
};

export function get(subpage: string): Promise<any>;

export function getAll(subpage: string, admin?: boolean): { 
  responses: any[],
  errors: any[]
};

export function post(subpage: string, data: object[] | object): { 
  responses: any[],
  errors: any[]
};

export function edit(subpage: string, newData: object[] | object): { 
  responses: any[],
  errors: any[]
};

export function deleteAllEntries_(subpage: string): Promise<any[]>

export function deleteBetween_(subpage: string, range: string[] | number[]): Promise<any[]>
