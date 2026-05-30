import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const societies = await prisma.society.findMany({
      orderBy: {
        society_id: "desc",
      },
    });

    return NextResponse.json(societies);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch societies", error },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const society = await prisma.society.create({
      data: {
        society_name: body.society_name,
        society_short_name: body.society_short_name,
        category: body.category,
        description: body.description,
        founded_date: body.founded_date ? new Date(body.founded_date) : null,
        status: body.status || "Active",
      },
    });

    return NextResponse.json(society, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create society", error },
      { status: 500 },
    );
  }
}
