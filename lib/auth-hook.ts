import { useEffect, useState } from "react";
import { getSession, Session } from "./auth";
import { useRouter } from "next/navigation";


export function useSession(): Session | null {
  const route = useRouter()
  const [session, setSes] = useState<Session>({
    permission: {
      GeneralConfigs: 0,
      Markers: 0,
      Minute: 0,
      MinuteType: 0,
      roles: 0,
      users: 0
    },
    role: "",
    user: ""
  });

  async function load() {
    const UserSession = await getSession() as Session;
    if (UserSession) {
      setSes(UserSession)
      
    } else {
      route.push("/")
    }

  };

  useEffect(() => {
    load()
  }, [])

  return session
}