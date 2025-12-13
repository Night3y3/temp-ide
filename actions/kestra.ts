'use server'

export async function triggerProvisioning(userId: string, finalPrompt: string) {
    const KESTRA_URL = process.env.KESTRA_URL;
    const USER = process.env.KESTRA_USERNAME;
    const PASS = process.env.KESTRA_PASSWORD;

    if (!USER || !PASS) return { error: "Server Configuration Error" };

    try {
        // 1. Prepare Inputs
        const formData = new FormData();
        formData.append("userId", userId);
        formData.append("projectDescription", finalPrompt);

        // 2. Trigger Kestra
        const response = await fetch(
            `${KESTRA_URL}/api/v1/executions/dev.agentic/agentic-ide-provisioner?wait=true`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Basic ${Buffer.from(`${USER}:${PASS}`).toString("base64")}`,
                },
                body: formData,
                cache: "no-store",
            }
        );

        if (!response.ok) {
            throw new Error(`Provisioning failed: ${response.statusText}`);
        }

        const data = await response.json();
        return { success: true, url: data.outputs.final_https_link };

    } catch (err: any) {
        return { success: false, error: err.message };
    }
}