import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const financeRecords = await prisma.finance.findMany({
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
      orderBy: {
        finance_id: "desc",
      },
    });

    return NextResponse.json(financeRecords);
  } catch (error) {
    console.error("GET finance error:", error);

    return NextResponse.json(
      { message: "Failed to fetch finance records" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const finance = await prisma.finance.create({
      data: {
        task_id: Number(body.task_id),
        admin_id: Number(body.admin_id),
        transaction_type: body.transaction_type,
        amount: body.amount,
        payment_method: body.payment_method,
        description: body.description,
        transaction_date: body.transaction_date
          ? new Date(body.transaction_date)
          : new Date(),
        status: body.status || "Recorded",
      },
    });

    return NextResponse.json(finance, { status: 201 });
  } catch (error) {
    console.error("POST finance error:", error);

    return NextResponse.json(
      { message: "Failed to create finance record" },
      { status: 500 },
    );
  }
}
