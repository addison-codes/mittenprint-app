import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Link from "next/link"
import Image from "next/image"

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const callbackUrl = "/";
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email,
      password,
      callbackUrl: callbackUrl ?? "/",
      redirect: false,
    });
    if (result?.error) {
      setError(result.error);
    }
    if (result?.ok) {
      router.push(callbackUrl);
    }
  };
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
    <Link className="mb-8" href="/">
              <a className="flex items-center">
                <div className="h-6 mr-3 sm-h-8">
              <Image
              width={32}
              height={32}
                alt=""
                src="/MPDLogo.png"
                className="h-6 mr-3 sm:h-8"
              />
              </div>
              <span className="self-center font-mono text-2xl font-semibold text-gray-700 whitespace-nowrap dark:text-white">
                Mitten Print Distribution
              </span>
              </a>
            </Link>
        {!!error && <p className="text-error">ERROR: {error}</p>}
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    Sign in to your account
                </h1>
                <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                        <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }} required={true} />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                        <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }} required={true} />
                    </div>
                    {/* <div className="flex items-center justify-between">
                        <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
                    </div> */}
                    <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center  dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" >Sign in</button>
                    {/* <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                        Don’t have an account yet? <a href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</a>
                    </p> */}
                </form>
            </div>
        </div>
    </div>
  </section>
)
                  }


    {/* <div className="container">
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center shadow-md card">
          <form className="card-body w-96" onSubmit={handleSubmit}>
            <h1 className="my-8 text-4xl">Sign In</h1>
            {!!error && <p className="text-error">ERROR: {error}</p>}
            <input
              type="text"
              className="input input-bordered"
              placeholder="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <input
              type="password"
              className="input input-bordered"
              placeholder="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <button className="btn" type="submit">
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div> */}

export default SignInPage;