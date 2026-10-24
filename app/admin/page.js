/** Default admin entry preserves the existing /admin URL and account view. */
import AdminWorkspace from './AdminWorkspace';

/** Authorization and account operations are shared with the dedicated routes. */
export default function Page() { return <AdminWorkspace />; }
