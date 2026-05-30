import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const societyId = Number(id);

    if (isNaN(societyId)) {
      return NextResponse.json(
        { message: "Invalid society ID" },
        { status: 400 },
      );
    }

    const society = await prisma.society.findUnique({
      where: {
        society_id: societyId,
      },
    });

    if (!society) {
      return NextResponse.json(
        { message: "Society not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(society);
  } catch (error) {
    console.error("GET society error:", error);

    return NextResponse.json(
      { message: "Failed to fetch society" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const societyId = Number(id);
    const body = await request.json();

    if (isNaN(societyId)) {
      return NextResponse.json(
        { message: "Invalid society ID" },
        { status: 400 },
      );
    }

    const society = await prisma.society.update({
      where: {
        society_id: societyId,
      },
      data: {
        society_name: body.society_name,
        society_short_name: body.society_short_name,
        category: body.category,
        description: body.description,
        founded_date: body.founded_date ? new Date(body.founded_date) : null,
        status: body.status,
      },
    });

    return NextResponse.json(society);
  } catch (error) {
    console.error("PATCH society error:", error);

    return NextResponse.json(
      { message: "Failed to update society" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const societyId = Number(id);

    if (isNaN(societyId)) {
      return NextResponse.json(
        { message: "Invalid society ID" },
        { status: 400 },
      );
    }

    await prisma.society.delete({
      where: {
        society_id: societyId,
      },
    });

    return NextResponse.json({
      message: "Society deleted successfully",
    });
  } catch (error) {
    console.error("DELETE society error:", error);

    return NextResponse.json(
      { message: "Failed to delete society" },
      { status: 500 },
    );
  }
}
