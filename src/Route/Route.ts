// api.ts
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
}

function getTimestamp() {
  return new Date().toISOString();
}

export async function getUI(projectId: string, uuid: string): Promise<ApiResponse> {
  const url = "https://superatom-ai-api-l8gm.vercel.app/api/runtime/prod/get_ui";

  console.log(`[${getTimestamp()}]  Sending API request`, { projectId, uuid });

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({  projectId, uuid }),
    });

    if (!res.ok) {
      console.error(
        `[${getTimestamp()}]  API request failed`,
        { projectId, uuid, status: res.status, statusText: res.statusText }
      );
      return {
        success: false,
        error: `HTTP error ${res.status}: ${res.statusText}`,
        status: res.status,
      };
    }

    const json = await res.json();
    console.log(`[${getTimestamp()}] ✅ API request success`, {
      projectId,
      uuid,
      keys: Object.keys(json?.data?.data || {}),
    });

    return { success: true, data: json, status: res.status };
  } catch (error: any) {
    console.error(`[${getTimestamp()}]  API request crashed`, {
      projectId,
      uuid,
      error: error.message || error,
    });
    return { success: false, error: error.message || String(error) };
  }
}
