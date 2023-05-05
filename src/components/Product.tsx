
export default function Product({ id, title, image }: { id: number, title: string, image: string }) {

     const counter = 1

     return (
          <div className="product p-4 bg-white border-2 hover:bg-slate-50 text-sm flex flex-col gap-4 items-center">
               <div>
                    <img src={image} alt={`product${id}`} className="object-cover h-[9rem]" />
               </div>
               <hr className="w-full" />
               <h2>{title}</h2>
               {counter < 1
                    ? <button className="bg-blue-500 py-2 text-white rounded-md mt-auto w-full hover:scale-105 duration-150">Add to cart</button>
                    : <div className="bottom-3 flex items-center mt-auto">
                         <button className="flex justify-center items-center bg-gray-300 rounded-full h-10 w-10 hover:scale-110 duration-150">-</button>
                         <span className="px-3">3 in cart</span>
                         <button className="flex justify-center items-center bg-gray-300 rounded-full h-10 w-10 hover:scale-110 duration-150">+</button>
                    </div>
               }
          </div>
     )
}
