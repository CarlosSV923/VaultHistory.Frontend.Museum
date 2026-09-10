'use client';
import { RouteError } from '@/shared/ui/route-error';
export default function Error({ reset }: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) { return <RouteError reset={reset} />; }
