
function ProductCard({image, price}){
    return(

        <div className = "flex flex-col overflow-hidden rounded bg-neutral-300">
        <img src = {image} alt = "" className = "aspect-square w-full object-cover"/>
        <p className = "p-2 text-center font-semibold">{price}</p>
        </div>

    );
}

export default ProductCard;

