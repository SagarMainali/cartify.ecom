import '../loading.css'

export default function Loading() {
     return (
          <div className="loading h-screen flex items-center justify-center">
               <div className="lds-ripple">
                    <div></div>
                    <div></div>
               </div>
          </div>
     )
}