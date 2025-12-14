'use server'

import prisma from "@/lib/prisma";

export async function triggerProvisioning(projectName: string, finalPrompt: string, projectId: string) {
    const KESTRA_URL = process.env.KESTRA_URL;
    const USER = process.env.KESTRA_USERNAME;
    const PASS = process.env.KESTRA_PASSWORD;

    if (!USER || !PASS) return { error: "Server Configuration Error" };

    try {
        const formData = new FormData();
        formData.append("userId", projectName);

        // ✅ FIX: Send the raw string. Kestra's "| json" filter will handle the safety.
        formData.append("projectDescription", finalPrompt);

        const response = await fetch(
            `${KESTRA_URL}/api/v1/executions/dev.agentic/agentic-ide-provisioner?wait=true`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Basic ${Buffer.from(`${USER}:${PASS}`).toString("base64")}`,
                    "ngrok-skip-browser-warning": "true",
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

        console.log(data);

        const url = data.outputs.final_https_link;
        const instanceId = data.outputs.instance_id;

        // Update database directly on server
        await prisma.project.update({
            where: { id: projectId },
            data: {
                url,
                instanceId,
                status: "active",
            },
        });

        return { success: true, url, instanceId };

    } catch (err: any) {
        // Optionally mark as failed in DB
        try {
            await prisma.project.update({
                where: { id: projectId },
                data: {
                    status: "terminated", // or "failed" if you have that status
                },
            });
        } catch (dbErr) {
            console.error("Failed to update failure status in DB", dbErr);
        }

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
                    "ngrok-skip-browser-warning": "true",
                },
                body: formData,
                cache: "no-store",
            }
        );

        if (!response.ok) throw new Error("Termination failed");

        // Update database to reflect termination
        // We use updateMany because instanceId technically might not be unique constraint in schema, 
        // though it is in practice.
        await prisma.project.updateMany({
            where: { instanceId: instanceId },
            data: { status: "terminated" }
        });

        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}