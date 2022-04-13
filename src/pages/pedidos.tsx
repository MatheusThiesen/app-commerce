import { Button } from "@chakra-ui/react";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const { signOut } = useAuth();

  return <Button onClick={signOut}>Logout</Button>;
}
