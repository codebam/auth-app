import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Missing authorization code" },
      { status: 400 },
    );
  }

  try {
    // Forward the code to the Cloudflare Worker
    const response = await fetch(
      `https://your-worker-url.workers.dev/api/auth/callback?code=${code}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch access token");
    }

    const data: { access_token: string } = await response.json();

    // Store the access token in a cookie
    const redirectResponse = NextResponse.redirect(
      new URL("/dashboard", request.url),
    );
    redirectResponse.cookies.set("token", data.access_token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return redirectResponse;
  } catch (error) {
    console.error("Error handling GitHub callback:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
