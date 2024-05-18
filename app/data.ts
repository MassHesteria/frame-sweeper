import { headers } from "next/headers";

export const getHostName = (): string => {
  if (process.env['HOST']) {
    return process.env['HOST']
  }
  const headersList = headers();
  const host = headersList.get('x-forwarded-host');
  const proto = headersList.get('x-forwarded-proto');
  return `${proto}://${host}`;
}

export const getHubRoute = (): string => {
  if (process.env['VERCEL_REGION']) {
    return 'https://nemes.farcaster.xyz:2281'
  }
  return 'http://localhost:3010/hub'
}