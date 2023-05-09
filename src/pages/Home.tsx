
import { useAuthContext } from "../context/context"

export default function Home() {

     const { logout, loggedInUser } = useAuthContext()

     return (
          <>
               <div>This is a Home page. Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam officiis iure maxime animi nesciunt, obcaecati esse debitis eligendi minima dignissimos.
               </div>
               <h2>{loggedInUser?.email}</h2>
               <button onClick={logout}>logout</button>
          </>
     )
}
