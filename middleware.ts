import { NextResponse } from "next/server";

import { NextRequest } from "next/server";


/**
 * Middleware function to handle incoming requests.
 * 
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse>} - The response object.
 * 
 * This middleware performs the following actions:
 * - For GET requests:
 *   - Retrieves the "session" cookie.
 *   - If the cookie exists, extends its expiration.
 *   - Returns the response.
 * - For PUT requests:
 *   - Simply forwards the request.
 * - For other requests:
 *   - Validates the "Origin" and "Host" headers.
 *   - If either header is missing or invalid, returns a 403 response.
 *   - If the headers are valid, forwards the request.
 */
export async function middleware(request:NextRequest):Promise<NextResponse>{
    if (request.method === "GET") {
      const response = NextResponse.next();
      const token = request.cookies.get("session")?.value ?? null;
      if (token !== null) {
        // Only extend cookie expiration on GET requests since we can be sure
        // a new session wasn't set when handling the request.
        response.cookies.set("session", token, {
          path: "/",
          maxAge: 60 * 60 * 24 * 30,
          sameSite: "lax",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        });
      }
      return response;
    }

    if (request.method=="PUT"){
        return NextResponse.next();
    }
    const originHeader = request.headers.get("Origin");

    const hostHeader = request.headers.get("Host");
    if(originHeader==null || hostHeader==null){
        return new NextResponse(null,{status:403});
    }
    let origin:URL;
    try{
        origin = new URL(originHeader);
    }catch{
        return new NextResponse(null,{status:403});
    }
    if(origin.host!=hostHeader){
        return new NextResponse(null,{status:403});
    }
    return NextResponse.next();
}