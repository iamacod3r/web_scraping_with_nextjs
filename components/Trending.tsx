
const Trending = () => {
  const productData =  [{id:1, name:'Apple Iphone 15 Pro Max 256GB', price:'$1100', image:'/assets/images/product1.jpg'}];
  return (
    <div className="flex flex-wrap gap-x-8 gap-y-16">
         {productData.map((product) => (
          <div key={product.id}>{product.name}</div>
         ))}
    </div>
  );
};

export default Trending;
