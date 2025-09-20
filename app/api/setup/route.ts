import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  message: string
}

export function GET(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
    return new Response(JSON.stringify({ message: 'Setup completed' }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
}