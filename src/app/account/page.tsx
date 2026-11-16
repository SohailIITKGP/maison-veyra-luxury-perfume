import type { Metadata } from "next";
import { AccountView } from "@/components/account/AccountView";

export const metadata: Metadata = { title: "Account", robots: { index: false } };

export default function AccountPage() {
  return (
    <div className="container-veyra pt-14 pb-28 md:pt-20">
      <h1 className="display mb-10 text-[3.2rem] md:text-[4.5rem]">Your account</h1>
      <AccountView />
    </div>
  );
}
