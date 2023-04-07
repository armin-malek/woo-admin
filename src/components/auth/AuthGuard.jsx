import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function AuthGuard({ children }) {
  //const { user, initializing, setRedirect } = useAuth();

  const [loading, setLoading] = useState(true);
  const { status } = useSession();
  //const router = useRouter();
  /*
  const { status } = useSession({
    required: true,
    onUnauthenticated: () => {
      setLoading(false);
      signIn();
    },
  });
  */

  useEffect(() => {
    async function securePage() {
      if (status == "loading") {
        setLoading(true);
        return;
      }

      setLoading(false);
      if (status == "unauthenticated") {
        signIn();
      }
      //if (status == "authenticated")
      //router.push("/signin");
    }
    securePage();
  }, [status]);

  /* show loading indicator while the auth provider is still initializing */
  if (loading) {
    return (
      <>
        <div className="container h-100">
          <div
            className="row justify-content-center align-items-center"
            style={{ height: "100vh" }}
          >
            <div className="spinner-border text-primary mx-auto">
              <span className="sr-only">در حال بارگذاری ...</span>
            </div>
          </div>
        </div>
        <style jsx>{`
          main {
            background-color: #d1d1d1 !important;
          }
        `}</style>
      </>
    );
  }

  /* otherwise don't return anything, will do a redirect from useEffect */
  //return null;
  return <>{children}</>;
}
