'use server'

export async function runKestraFlow(userMessage: string) {
    const KESTRA_URL = process.env.KESTRA_URL;
    const USER = process.env.KESTRA_USERNAME;
    const PASS = process.env.KESTRA_PASSWORD;

    if (!USER || !PASS) return { error: "Missing Env Vars" };

    try {
        // 1. Prepare Inputs as FormData
        const formData = new FormData();
        formData.append("custom_message", userMessage);

        // 2. Call Kestra API
        const response = await fetch(
            `${KESTRA_URL}/api/v1/executions/company.team/bat_692293?wait=true`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Basic ${Buffer.from(`${USER}:${PASS}`).toString("base64")}`,
                    // Do NOT set Content-Type header manually when using FormData; 
                    // fetch sets the boundary automatically.
                },
                body: formData,
                cache: "no-store",
            }
        );

        if (!response.ok) {
            throw new Error(`Kestra failed: ${response.statusText}`);
        }

        const data = await response.json();

        // 3. Return the dynamic output
        return { success: true, message: data.outputs.response_text };

    } catch (err: any) {
        return { success: false, error: err.message };
    }
}