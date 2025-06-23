import {
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Snackbar, Alert, Avatar } from "@mui/material";


const MICROSOFT_LOGIN_URL = "http://localhost:5002/login?redirect_uri=http://localhost:5173/home";

export function SignUp() {
  // Simulated user state for SSO
  const [user, setUser] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Simulate SSO login
  const handleSSOLogin = (provider) => {
    // In real app, replace with actual SSO logic
    const fakeUser = {
      name: provider === 'Google' ? 'John Doe' : 'Jane Smith',
      email: provider === 'Google' ? 'john.doe@gmail.com' : 'jane.smith@twitter.com',
      avatar: provider === 'Google' ? '/img/team-5.png' : '/img/team-4.png',
      provider,
    };
    setUser(fakeUser);
    setSnackbar({ open: true, message: `Signed in successfully with ${provider}!`, severity: 'success' });
  };

  // Logout logic
  const handleLogout = () => {
    setUser(null);
    setSnackbar({ open: true, message: 'Logged out successfully!', severity: 'info' });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <section className="m-8 flex">
            <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>
      <div className="w-full lg:w-3/5 flex flex-col items-center justify-center">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Join Us Today</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your email and password to register.</Typography>
        </div>
        {/* Show user profile if logged in */}
        {user ? (
          <div className="flex flex-col items-center gap-4 mt-8 mb-8">
            <Avatar src={user.avatar} alt={user.name} sx={{ width: 64, height: 64 }} />
            <Typography variant="h5">Welcome, {user.name}!</Typography>
            <Typography variant="body1" color="blue-gray">{user.email}</Typography>
            <Button color="red" onClick={handleLogout} className="mt-2">Logout</Button>
          </div>
        ) : (
          <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
            <div className="mb-1 flex flex-col gap-6">
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Your email
              </Typography>
              <Input
                size="lg"
                placeholder="name@mail.com"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <Checkbox
              label={
                <Typography
                  variant="small"
                  color="gray"
                  className="flex items-center justify-start font-medium"
                >
                  I agree the&nbsp;
                  <a
                    href="#"
                    className="font-normal text-black transition-colors hover:text-gray-900 underline"
                  >
                    Terms and Conditions
                  </a>
                </Typography>
              }
              containerProps={{ className: "-ml-2.5" }}
            />
            <Button className="mt-6" fullWidth>
              Register Now
            </Button>

            <div className="space-y-4 mt-8">
              <a href={MICROSOFT_LOGIN_URL}>
                <Button size="lg" color="white" className="flex items-center gap-2 justify-center shadow-md" fullWidth>
                  <img src="/img/microsoft-logo.svg" height={24} width={24} alt="Microsoft" />
                  <span>Sign in With Microsoft</span>
                </Button>
              </a>
              <Button size="lg" color="white" className="flex items-center gap-2 justify-center shadow-md" fullWidth onClick={() => handleSSOLogin('Google')}>
                <img src="/img/google-logo.svg" height={24} width={24} alt="Google" />
                <span>Sign in With Google</span>
              </Button>
              <Button size="lg" color="white" className="flex items-center gap-2 justify-center shadow-md" fullWidth onClick={() => handleSSOLogin('Twitter')}>
                <img src="/img/twitter-logo.svg" height={24} width={24} alt="Twitter" />
                <span>Sign in With Twitter</span>
              </Button>
            </div>
            <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
              Already have an account?
              <Link to="/sign-in" className="text-gray-900 ml-1">Sign in</Link>
            </Typography>
          </form>
        )}
        <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </section>
  );
}

export default SignUp;
