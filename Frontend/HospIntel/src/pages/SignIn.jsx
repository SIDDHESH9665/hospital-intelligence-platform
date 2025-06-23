import {
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { useState } from "react";

// Add backend Google SSO login URL
const GOOGLE_LOGIN_URL = "http://localhost:5002/login?redirect_uri=http://localhost:5173/home";

export function SignIn({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login (replace with real API call)
    if (email && password) {
      const fakeUser = {
        name: email.split("@")[0],
        email,
        avatar: "/img/team-5.png",
      };
      setUser(fakeUser);
      window.location.href = "/home";
    } else {
      setError("Please enter email and password");
    }
  };

  return (
    <section className="w-screen h-screen flex gap-4 overflow-hidden bg-white">
      <div className="w-full lg:w-3/5 flex flex-col justify-center items-center h-screen">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Sign In</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your email and password to Sign In.</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleSubmit}>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Your email
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              value={password}
              onChange={e => setPassword(e.target.value)}
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
          {error && <Typography color="red" className="text-center mt-2">{error}</Typography>}
          <Button className="mt-6" fullWidth type="submit">
            Sign In
          </Button>

          <div className="flex items-center justify-between gap-2 mt-6">
            <Checkbox
              label={
                <Typography
                  variant="small"
                  color="gray"
                  className="flex items-center justify-start font-medium"
                >
                  Subscribe me to newsletter
                </Typography>
              }
              containerProps={{ className: "-ml-2.5" }}
            />
            <Typography variant="small" className="font-medium text-gray-900">
              <a href="#">
                Forgot Password
              </a>
            </Typography>
          </div>
          <div className="space-y-4 mt-8">
            {/* Microsoft SSO Button */}
            <a href={GOOGLE_LOGIN_URL}>
               <Button size="lg" color="white" className="flex items-center gap-2 justify-center shadow-md" fullWidth>
                {/* Microsoft Icon SVG */}
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="9" height="9" x="1" y="1" fill="#F35325"/>
                  <rect width="9" height="9" x="10" y="1" fill="#81BC06"/>
                  <rect width="9" height="9" x="1" y="10" fill="#05A6F0"/>
                  <rect width="9" height="9" x="10" y="10" fill="#FFBA08"/>
                </svg>
                Continue with Microsoft
              </Button>
            </a>
            <Button size="lg" color="white" className="flex items-center gap-2 justify-center shadow-md" fullWidth>
              <img src="/img/twitter-logo.svg" height={24} width={24} alt="" />
              <span>Sign in With Twitter</span>
            </Button>
          </div>
          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            Not registered?
            <Link to="/sign-up" className="text-gray-900 ml-1">Create account</Link>
          </Typography>
        </form>
      </div>
      <div className="w-2/5 h-full hidden lg:block relative">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover"
        />
       
        <img
          src="/img/logo.png"
          alt="Logo"
          className="absolute top-1/2 left-1/2 w-34 h-32 object-contain -translate-x-1/2 -translate-y-1/2 drop-shadow-lg  rounded-full p-2"
        />
      </div>
    </section>
  );
}

export default SignIn;