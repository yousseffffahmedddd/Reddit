// app/profile/page.tsx
import Link from 'next/link';

export default function ProfilePage() {
  const user = {
    name: 'John Doe',
    karma: 1234,
  };

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Profile</h1>
      <p>Name: {user.name}</p>
      <p>Karma: {user.karma}</p>
      <Link href="/">Back to Home</Link>
    </main>
  );
}
