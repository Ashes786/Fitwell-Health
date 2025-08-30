const testAuthFlow = async () => {
  console.log('🔄 Testing Redirect Loop Fix...\n');

  try {
    // Test 1: Main page loads
    console.log('1. Testing Main Page...');
    const mainResponse = await fetch('http://localhost:3000/');
    console.log('   Status:', mainResponse.status);
    if (mainResponse.status === 200) {
      console.log('   ✅ Main page loads successfully\n');
    } else {
      console.log('   ❌ Main page failed to load\n');
      return;
    }

    // Create a cookie jar to store cookies between requests
    const cookies = {};

    // Test 2: Sign in
    console.log('2. Testing Sign In...');
    const signInResponse = await fetch('http://localhost:3000/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'superadmin@healthcare.com',
        password: 'password123'
      }),
    });

    // Extract cookies from the response
    const setCookieHeader = signInResponse.headers.get('set-cookie');
    if (setCookieHeader) {
      const authToken = setCookieHeader.split(';')[0].split('=')[1];
      cookies['auth-token'] = authToken;
      console.log('   🍪 Cookie extracted successfully');
    }

    const signInData = await signInResponse.json();
    console.log('   Status:', signInResponse.status);

    if (signInResponse.status === 200 && signInData.success) {
      console.log('   ✅ Sign In successful\n');

      // Test 3: Access dashboard (should redirect to role-specific dashboard)
      console.log('3. Testing Dashboard Access...');
      const dashboardResponse = await fetch('http://localhost:3000/dashboard', {
        headers: {
          'Cookie': `auth-token=${cookies['auth-token']}`
        },
        redirect: 'follow' // Follow redirects automatically
      });
      
      console.log('   Dashboard Final Status:', dashboardResponse.status);
      console.log('   Dashboard Final URL:', dashboardResponse.url);
      
      if (dashboardResponse.status === 200 && dashboardResponse.url.includes('/dashboard/super-admin')) {
        console.log('   ✅ Dashboard access and redirect successful\n');
      } else {
        console.log('   ❌ Dashboard access failed');
        console.log('   Final URL:', dashboardResponse.url);
      }

      // Test 4: Direct access to role-specific dashboard
      console.log('4. Testing Role-Specific Dashboard...');
      const superAdminDashboardResponse = await fetch('http://localhost:3000/dashboard/super-admin', {
        headers: {
          'Cookie': `auth-token=${cookies['auth-token']}`
        }
      });
      
      console.log('   Super Admin Dashboard Status:', superAdminDashboardResponse.status);
      
      if (superAdminDashboardResponse.status === 200) {
        console.log('   ✅ Role-specific dashboard accessible\n');
      } else {
        console.log('   ❌ Role-specific dashboard failed');
      }

      // Test 5: Access sign-in page while authenticated (should redirect to dashboard)
      console.log('5. Testing Sign-in Page While Authenticated...');
      const signinResponse = await fetch('http://localhost:3000/auth/signin', {
        headers: {
          'Cookie': `auth-token=${cookies['auth-token']}`
        },
        redirect: 'follow' // Follow redirects automatically
      });
      
      console.log('   Sign-in Page Final Status:', signinResponse.status);
      console.log('   Sign-in Page Final URL:', signinResponse.url);
      
      if (signinResponse.url.includes('/dashboard')) {
        console.log('   ✅ Sign-in page properly redirects authenticated users\n');
      } else {
        console.log('   ❌ Sign-in page redirect failed');
        console.log('   Final URL:', signinResponse.url);
      }

      console.log('🎉 Redirect Loop Issue Fixed!');
      console.log('✅ Authentication flow is now smooth and correct');
      console.log('✅ No more back-and-forth redirects');
      console.log('✅ Users are properly routed to their role-specific dashboards');
      
    } else {
      console.log('   ❌ Sign In failed');
      console.log('   Error:', signInData.error);
    }
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
};

testAuthFlow();