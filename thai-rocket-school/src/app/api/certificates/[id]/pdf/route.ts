import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateCertificatePdf } from "@/lib/certificate";
import { lt } from "@/lib/utils";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const cert = await prisma.certificate.findUnique({
    where: { id },
    include: { user: true, course: true },
  });
  if (!cert) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (cert.userId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const pdf = await generateCertificatePdf({
    studentName: cert.user.name ?? cert.user.email,
    courseTitle: lt(cert.course.title, cert.user.locale),
    serial: cert.serial,
    issuedAt: cert.issuedAt,
    locale: cert.user.locale,
  });

  return new NextResponse(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="thairocketschool-certificate-${cert.serial}.pdf"`,
      "Cache-Control": "private, max-age=0",
    },
  });
}
