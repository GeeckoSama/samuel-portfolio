import { component$, useContext } from "@builder.io/qwik";
import { UserContext } from "~/components/AuthContext/AuthContext";
import { Dashboard } from "~/components/dashboard/dashboard";
import { Sigin } from "~/components/sigin/sigin";

export default component$(() => {
  const user = useContext(UserContext);

  return <>{user.value ? <Dashboard /> : <Sigin />}</>;
});
