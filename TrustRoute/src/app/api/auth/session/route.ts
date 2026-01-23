import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return NextResponse.json({ authenticated: true, user: payload }, { status: 200 });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}

export async function DELETE() {
  // Logout: clear cookie
  const res = NextResponse.json({ message: "Logged out" });
  res.cookies.set("auth_token", "", { httpOnly: true, maxAge: 0, path: "/" });
  return res;
}
