
export default function Product({ id, title, image }: { id: number, title: string, image: string }) {
     return (
          <div className="product p-2 bg-white border-2">
               <div className="flex flex-col items-center mb-3">
                    <img src={image} alt={`product${id}`} className="object-cover h-[9rem]" />
               </div>
               <h2>{title}</h2>
          </div>
     )
}
