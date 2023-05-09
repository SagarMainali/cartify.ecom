
import { useAuthContext } from "../context/context"

export default function Home() {

     const { logout, loggedInUser } = useAuthContext()

     return (
          <>
               <div>This is a Home page. Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam officiis iure maxime animi nesciunt, obcaecati esse debitis eligendi minima dignissimos.
               </div>
               <h2 className="my-4">Logged in as: <i className="font-semibold">{loggedInUser?.email}</i></h2>
               <button className="bg-blue-500 text-white px-4 py-1.5 rounded-md" onClick={() => logout()}>Logout</button>
          </>
     )
}
