
'use client';
import Link from 'next/link';

 // Required for client-side hooks
import { useRouter } from 'next/navigation';
import Navbar from './components/Navbar';

export default function HomePage() {
  const router = useRouter();

  return (
  <Navbar/>
  );
}
