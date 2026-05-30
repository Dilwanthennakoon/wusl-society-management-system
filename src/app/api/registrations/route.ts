import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const registrations = await prisma.registration.findMany({
      include: {
        society: true,
        admin: true,
        membership: true,
      },
      orderBy: {
        registration_id: "desc",
      },
    });

    return NextResponse.json(registrations);
  } catch (error) {
    console.error("GET registrations error:", error);

    return NextResponse.json(
      { message: "Failed to fetch registrations" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const registration = await prisma.registration.create({
      data: {
        society_id: Number(body.society_id),
        admin_id: body.admin_id ? Number(body.admin_id) : null,
        student_name: body.student_name,
        student_index_no: body.student_index_no,
        student_email: body.student_email,
        student_phone: body.student_phone,
        faculty: body.faculty,
        department: body.department,
        academic_year: body.academic_year,
        status: body.status || "Pending",
      },
    });

    return NextResponse.json(registration, { status: 201 });
  } catch (error) {
    console.error("POST registration error:", error);

    return NextResponse.json(
      { message: "Failed to create registration" },
      { status: 500 },
    );
  }
}
