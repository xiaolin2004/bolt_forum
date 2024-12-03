"use client";

import Head from "next/head";
// @ts-expect-error
import { useActionState, useState } from "react";
// @ts-expect-error
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { LogIn } from "../action/User";

const initialState = {
  message: "",
};

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      aria-disabled={pending}
      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      登录
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useActionState(LogIn, initialState);

  return (
    <>
      <Head>
        <title>登录 - Bolt Forum</title>
        <meta name="description" content="登录到您的 Bolt Forum 账户。" />
      </Head>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              登录账户
            </h2>
          </div>
          <form action={formAction} className="mt-8 space-y-6">
            {state.message!="" && (
              <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                {state.message}
              </div>
            )}
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  邮箱地址
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="请输入邮箱"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  密码
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="请输入密码"
                />
              </div>
            </div>

            <div>
              <LoginButton />
            </div>

            <div className="text-sm text-center">
              <span className="text-gray-600">还没有账户？</span>{" "}
              <Link
                href="/register"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                立即注册
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
