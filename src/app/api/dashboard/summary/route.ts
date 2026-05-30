import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalSocieties,
      totalRegistrations,
      pendingRegistrations,
      approvedRegistrations,
      totalMembers,
      totalEvents,
      totalTasks,
      pendingTasks,
      completedTasks,
      incomeRecords,
      expenseRecords,
      recentEvents,
      recentTasks,
    ] = await Promise.all([
      prisma.society.count(),

      prisma.registration.count(),

      prisma.registration.count({
        where: {
          status: "Pending",
        },
      }),

      prisma.registration.count({
        where: {
          status: "Approved",
        },
      }),

      prisma.membership.count(),

      prisma.event.count(),

      prisma.task.count(),

      prisma.task.count({
        where: {
          task_status: "Pending",
        },
      }),

      prisma.task.count({
        where: {
          task_status: "Completed",
        },
      }),

      prisma.finance.findMany({
        where: {
          transaction_type: "Income",
        },
        select: {
          amount: true,
        },
      }),

      prisma.finance.findMany({
        where: {
          transaction_type: "Expense",
        },
        select: {
          amount: true,
        },
      }),

      prisma.event.findMany({
        take: 5,
        orderBy: {
          event_id: "desc",
        },
        include: {
          society: true,
        },
      }),

      prisma.task.findMany({
        take: 5,
        orderBy: {
          task_id: "desc",
        },
        include: {
          event: true,
        },
      }),
    ]);

    const totalIncome = incomeRecords.reduce((total, record) => {
      return total + Number(record.amount);
    }, 0);

    const totalExpense = expenseRecords.reduce((total, record) => {
      return total + Number(record.amount);
    }, 0);

    const balance = totalIncome - totalExpense;

    return NextResponse.json({
      summary: {
        totalSocieties,
        totalRegistrations,
        pendingRegistrations,
        approvedRegistrations,
        totalMembers,
        totalEvents,
        totalTasks,
        pendingTasks,
        completedTasks,
        totalIncome,
        totalExpense,
        balance,
      },
      recentEvents,
      recentTasks,
    });
  } catch (error) {
    console.error("GET dashboard summary error:", error);

    return NextResponse.json(
      { message: "Failed to fetch dashboard summary" },
      { status: 500 },
    );
  }
}
