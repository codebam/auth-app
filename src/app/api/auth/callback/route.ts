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

  console.log("Authorization code:", code);

  try {
    // Forward the code to the Cloudflare Worker
    const workerUrl = `https://auth-worker.codebam.workers.dev/api/auth/callback?code=${code}`;
    console.log("Making request to worker:", workerUrl);

    const response = await fetch(workerUrl);

    console.log("Worker response status:", response.status);
    console.log("Worker response data:", await response.json());

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
