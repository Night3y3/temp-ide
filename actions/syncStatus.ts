'use server'

import prisma from "@/lib/prisma";

interface SyncResult {
    synced: number;
    errors: string[];
}

/**
 * Syncs project statuses by checking instance availability via a simple fetch.
 * If the IDE URL is unreachable (503/502/connection refused), marks as terminated.
 */
export async function syncProjectStatuses(): Promise<SyncResult> {
    let synced = 0;
    const errors: string[] = [];

    try {
        // Get all active projects with URLs
        const activeProjects = await prisma.project.findMany({
            where: {
                status: "active",
                url: { not: null },
            },
            select: {
                id: true,
                url: true,
                instanceId: true,
            },
        });

        // Check each project's URL
        for (const project of activeProjects) {
            if (!project.url) continue;

            try {
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 5000); // 5 second timeout

                const res = await fetch(project.url, {
                    method: "HEAD",
                    signal: controller.signal,
                    cache: "no-store",
                });

                clearTimeout(timeout);

                // If we get 502, 503, or the connection fails, the instance is likely down
                if (res.status === 502 || res.status === 503 || res.status === 504) {
                    await prisma.project.update({
                        where: { id: project.id },
                        data: { status: "terminated" },
                    });
                    synced++;
                }
            } catch (fetchErr: any) {
                // Connection refused, timeout, etc. = instance is down
                if (
                    fetchErr.name === "AbortError" ||
                    fetchErr.code === "ECONNREFUSED" ||
                    fetchErr.cause?.code === "ECONNREFUSED" ||
                    fetchErr.message?.includes("fetch failed")
                ) {
                    await prisma.project.update({
                        where: { id: project.id },
                        data: { status: "terminated" },
                    });
                    synced++;
                } else {
                    errors.push(`Project ${project.id}: ${fetchErr.message}`);
                }
            }
        }
    } catch (err: any) {
        errors.push(`Database error: ${err.message}`);
    }

    return { synced, errors };
}
