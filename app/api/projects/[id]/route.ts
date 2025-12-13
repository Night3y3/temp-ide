import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken, getTokenFromCookie } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const cookieHeader = req.headers.get("cookie");
    const token = getTokenFromCookie(cookieHeader);

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const project = await prisma.project.findFirst({
      where: {
        id: params.id,
        userId: payload.userId,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Get project error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const cookieHeader = req.headers.get("cookie");
    const token = getTokenFromCookie(cookieHeader);

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();

    const project = await prisma.project.updateMany({
      where: {
        id: params.id,
        userId: payload.userId,
      },
      data: body,
    });

    if (project.count === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const updatedProject = await prisma.project.findUnique({
      where: { id: params.id },
    });

    return NextResponse.json({ project: updatedProject });
  } catch (error) {
    console.error("Update project error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const cookieHeader = req.headers.get("cookie");
    const token = getTokenFromCookie(cookieHeader);

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const project = await prisma.project.deleteMany({
      where: {
        id: params.id,
        userId: payload.userId,
      },
    });

    if (project.count === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete project error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

