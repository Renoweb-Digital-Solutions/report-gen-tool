/** Feedback deep link reuses AdminWorkspace's admin-session entry guard and navigation. */
import AdminWorkspace from '../AdminWorkspace';

/** Render the private inbox section; backend admin authorization remains mandatory. */
export default function Page() {
  return <AdminWorkspace initialSection="feedback" />;
}
