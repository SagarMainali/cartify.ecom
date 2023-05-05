import { useEffect, useState } from 'react'

export default function Store() {

     const [data, setData] = useState()

     useEffect(() => {
          fetch('https://fakestoreapi.com/products/category/jewelery/?limit=2')
               .then(res => res.json())
               .then(json => setData(json))
     }, [])
     return (
          <div className="store">
               {data ? <h2>{JSON.stringify(data)}</h2> : <h2>getting products...</h2>}
          </div>
     )
}
