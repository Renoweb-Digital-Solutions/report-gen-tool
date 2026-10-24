/** Dedicated admin route; shared workspace retains existing auth and operations. */
import AdminWorkspace from '../AdminWorkspace';

/** Render the route-selected section; authorization is checked by AdminWorkspace/API. */
export default function Page() {
  return <AdminWorkspace initialSection="users" />;
}
