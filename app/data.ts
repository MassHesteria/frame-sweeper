import { headers } from "next/headers";

export const getHostName = (): string => {
  if (process.env['HOST']) {
    console.log('using',process.env['HOST'])
    return process.env['HOST']
  }
  console.log("not using host")
  const headersList = headers();
  const host = headersList.get('x-forwarded-host');
  const proto = headersList.get('x-forwarded-proto');
  return `${proto}://${host}`;
}
