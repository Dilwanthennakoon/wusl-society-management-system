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
    const financeId = Number(id);

    if (isNaN(financeId)) {
      return NextResponse.json(
        { message: "Invalid finance ID" },
        { status: 400 },
      );
    }

    const finance = await prisma.finance.findUnique({
      where: {
        finance_id: financeId,
      },
      include: {
        task: {
          include: {
            event: true,
          },
        },
        admin: true,
        report_finances: {
          include: {
            report: true,
          },
        },
      },
    });

    if (!finance) {
      return NextResponse.json(
        { message: "Finance record not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(finance);
  } catch (error) {
    console.error("GET finance error:", error);

    return NextResponse.json(
      { message: "Failed to fetch finance record" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const financeId = Number(id);
    const body = await request.json();

    if (isNaN(financeId)) {
      return NextResponse.json(
        { message: "Invalid finance ID" },
        { status: 400 },
      );
    }

    const finance = await prisma.finance.update({
      where: {
        finance_id: financeId,
      },
      data: {
        task_id: body.task_id ? Number(body.task_id) : undefined,
        admin_id: body.admin_id ? Number(body.admin_id) : undefined,
        transaction_type: body.transaction_type,
        amount: body.amount,
        payment_method: body.payment_method,
        description: body.description,
        transaction_date: body.transaction_date
          ? new Date(body.transaction_date)
          : undefined,
        status: body.status,
      },
    });

    return NextResponse.json(finance);
  } catch (error) {
    console.error("PATCH finance error:", error);

    return NextResponse.json(
      { message: "Failed to update finance record" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const financeId = Number(id);

    if (isNaN(financeId)) {
      return NextResponse.json(
        { message: "Invalid finance ID" },
        { status: 400 },
      );
    }

    await prisma.finance.delete({
      where: {
        finance_id: financeId,
      },
    });

    return NextResponse.json({
      message: "Finance record deleted successfully",
    });
  } catch (error) {
    console.error("DELETE finance error:", error);

    return NextResponse.json(
      { message: "Failed to delete finance record" },
      { status: 500 },
    );
  }
}
