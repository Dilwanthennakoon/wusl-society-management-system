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
    const memberId = Number(id);

    if (isNaN(memberId)) {
      return NextResponse.json(
        { message: "Invalid member ID" },
        { status: 400 },
      );
    }

    const member = await prisma.membership.findUnique({
      where: {
        membership_id: memberId,
      },
      include: {
        society: true,
        registration: true,
        event_members: {
          include: {
            event: true,
          },
        },
        task_assignments: {
          include: {
            task: true,
          },
        },
      },
    });

    if (!member) {
      return NextResponse.json(
        { message: "Member not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(member);
  } catch (error) {
    console.error("GET member error:", error);

    return NextResponse.json(
      { message: "Failed to fetch member" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const memberId = Number(id);
    const body = await request.json();

    if (isNaN(memberId)) {
      return NextResponse.json(
        { message: "Invalid member ID" },
        { status: 400 },
      );
    }

    const member = await prisma.membership.update({
      where: {
        membership_id: memberId,
      },
      data: {
        student_name: body.student_name,
        student_index_no: body.student_index_no,
        student_email: body.student_email,
        member_role: body.member_role,
        membership_status: body.membership_status,
      },
    });

    return NextResponse.json(member);
  } catch (error) {
    console.error("PATCH member error:", error);

    return NextResponse.json(
      { message: "Failed to update member" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const memberId = Number(id);

    if (isNaN(memberId)) {
      return NextResponse.json(
        { message: "Invalid member ID" },
        { status: 400 },
      );
    }

    await prisma.membership.delete({
      where: {
        membership_id: memberId,
      },
    });

    return NextResponse.json({
      message: "Member deleted successfully",
    });
  } catch (error) {
    console.error("DELETE member error:", error);

    return NextResponse.json(
      { message: "Failed to delete member" },
      { status: 500 },
    );
  }
}
