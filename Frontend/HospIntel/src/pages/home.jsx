import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Button,
  IconButton,
  Input,
  Textarea,
  Checkbox,
} from "@material-tailwind/react";
import { FingerPrintIcon, UsersIcon } from "@heroicons/react/24/solid";
import { PageTitle, Footer } from "@/widgets/layout";
import { FeatureCard, TeamCard } from "@/widgets/cards";
import { featuresData, teamData, contactData } from "@/data";

export function Home() {
  return (
    <>
      <div className="relative flex h-screen content-center items-center justify-center pb-32">
        <div className="absolute top-0 h-full w-full bg-[url('/img/bg2.jpeg')] bg-cover bg-center filter blur-sm" />
        <div className="absolute top-0 h-full w-full bg-black/60 bg-cover bg-center" />
        <div className="max-w-8xl container relative mx-auto">
          <div className="flex flex-wrap items-center">
            <div className="ml-auto mr-auto w-full px-4 text-center lg:w-8/12">
              <Typography
                variant="h1"
                color="white"
                className="mb-6 font-black"
              >
                Hospital Intelligence Repository
              </Typography>
              <Typography variant="lead" color="white" className="opacity-80">
                A comprehensive analytics platform providing a 360° view of hospital operations,
                including hospital profiling, claims management, administrative insights, and performance
                metrics to drive data-driven decision-making.
              </Typography>
            </div>
          </div>
        </div>
      </div>
      <section className="-mt-32 px-4 pb-20 pt-[12rem]">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-[12rem] gap-y-12 place-items-center">
            {featuresData.map(({ color, title, icon, description, link }) => (
              <FeatureCard
                key={title}
                color={color}
                title={title}
                icon={React.createElement(icon, {
                  className: "w-5 h-5 text-white",
                })}
                description={description}
                link={link}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="relative bg-white py-24 px-4">
        <div className="container mx-auto">
          <PageTitle section="Analytics Platform" heading="Comprehensive Healthcare Insights">
            Our platform provides deep analytical insights into hospital operations, claims processing, and cost management. 
            Leverage advanced data analytics to make informed decisions and optimize healthcare delivery.
          </PageTitle>
          <div className="mx-auto mt-20 mb-24 grid max-w-5xl grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-3">
            <Card
              color="transparent"
              shadow={false}
              className="text-center text-blue-gray-900"
            >
              <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-full bg-blue-gray-900 shadow-lg shadow-gray-500/20">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <Typography variant="h5" color="blue-gray" className="mb-2">
                Analytics Suite
              </Typography>
              <Typography className="font-normal text-blue-gray-500">
                Track KPIs and optimize healthcare delivery with our analytics suite.
              </Typography>
            </Card>

            <Card
              color="transparent"
              shadow={false}
              className="text-center text-blue-gray-900"
            >
              <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-full bg-blue-gray-900 shadow-lg shadow-gray-500/20">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <Typography variant="h5" color="blue-gray" className="mb-2">
                Real-time Insights
              </Typography>
              <Typography className="font-normal text-blue-gray-500">
                Make quick decisions with real-time analytics and market insights.
              </Typography>
            </Card>

            <Card
              color="transparent"
              shadow={false}
              className="text-center text-blue-gray-900"
            >
              <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-full bg-blue-gray-900 shadow-lg shadow-gray-500/20">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <Typography variant="h5" color="blue-gray" className="mb-2">
                Quick Setup
              </Typography>
              <Typography className="font-normal text-blue-gray-500">
                Get started quickly with our ready-to-use platform.
              </Typography>
            </Card>
          </div>
        </div>
      </section>
      <section id="contact" className="relative bg-white py-12 px-4">
        <div className="container mx-auto">
          <PageTitle section="Contact Us" heading="Get in Touch">
            Have questions? We're here to help.
          </PageTitle>
          <form className="mx-auto w-full mt-8 lg:w-5/12">
            <div className="mb-8 flex gap-8">
              <Input variant="outlined" size="lg" label="Full Name" />
              <Input variant="outlined" size="lg" label="Email Address" />
            </div>
            <Textarea variant="outlined" size="lg" label="Message" rows={8} />
            <Checkbox
              label={
                <Typography
                  variant="small"
                  color="gray"
                  className="flex items-center font-normal"
                >
                  I agree the
                  <a
                    href="#"
                    className="font-medium transition-colors hover:text-gray-900"
                  >
                    &nbsp;Terms and Conditions
                  </a>
                </Typography>
              }
              containerProps={{ className: "-ml-2.5" }}
            />
            <Button variant="gradient" size="lg" className="mt-8" fullWidth>
              Send Message
            </Button>
          </form>
        </div>
      </section>
      <section id="about" className="relative bg-white py-12 px-4">
        <div className="container mx-auto">
          <PageTitle section="About Us" heading="HospIntel">
          A powerful healthcare analytics platform that provides deep insights into hospital operations, claims processing, and cost management. Make data-driven decisions with our comprehensive suite of analytical tools.
          </PageTitle>
        </div>
      </section>
      <div className="bg-white">
        <Footer />
      </div>
    </>
  );
}

export default Home;
