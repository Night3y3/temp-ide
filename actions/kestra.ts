'use server'

export async function triggerProvisioning(projectName: string, finalPrompt: string) {
    const KESTRA_URL = process.env.KESTRA_URL;
    const USER = process.env.KESTRA_USERNAME;
    const PASS = process.env.KESTRA_PASSWORD;

    if (!USER || !PASS) return { error: "Server Configuration Error" };

    try {
        const formData = new FormData();
        formData.append("projectName", projectName);

        // ✅ FIX: Send the raw string. Kestra's "| json" filter will handle the safety.
        formData.append("projectDescription", finalPrompt);

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
            const errText = await response.text();
            console.error("Kestra Error:", errText);
            throw new Error(`Kestra failed: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.outputs?.final_https_link) {
            return { success: false, error: "Flow finished but returned no URL." };
        }

        return { success: true, url: data.outputs.final_https_link, instanceId: data.outputs.instance_id };

    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function triggerTermination(instanceId: string) {
    const KESTRA_URL = process.env.KESTRA_URL;
    const USER = process.env.KESTRA_USERNAME;
    const PASS = process.env.KESTRA_PASSWORD;

    try {
        const formData = new FormData();
        formData.append("instanceId", instanceId);

        const response = await fetch(
            `${KESTRA_URL}/api/v1/executions/dev.agentic/agentic-ide-terminator?wait=true`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Basic ${Buffer.from(`${USER}:${PASS}`).toString("base64")}`,
                },
                body: formData,
                cache: "no-store",
            }
        );

        if (!response.ok) throw new Error("Termination failed");

        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}