import { cookies } from 'next/headers';
import Image from 'next/image';

interface GitHubUserData {
  login: string;
  name: string;
  avatar_url: string;
  email: string;
}

const DashboardPage = async () => {
  // Get the token from cookies
  const token = cookies().get('token')?.value;

  // Fetch user data using the access token
  const response = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }

  const userData: GitHubUserData = await response.json();

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Welcome, {userData.name}!</h1>
      <Image
        src={userData.avatar_url}
        alt="Profile"
        style={{ width: '100px', borderRadius: '50%' }}
      />
      <p>Username: {userData.login}</p>
      <p>Email: {userData.email}</p>
    </div>
  );
};

export default DashboardPage;
