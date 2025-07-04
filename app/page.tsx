import FormLogin from "@/components/form-login";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";


export default async function Home() {

  const user = await getSession();

  if (user) {
    redirect("/dashboard")
  } 


  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <FormLogin>
        
      </FormLogin>
    </div>
  );
}
