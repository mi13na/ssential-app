function ProductSkeleton() {
  return (
    <div className="mx-auto grid max-w-5xl grid-cols-4 gap-4">
      {Array.from({ length: 20 }).map((_, index) => (
        <div
          key={index}
          className="aspect-square animate-pulse rounded bg-neutral-400"
        ></div>
      ))}
    </div>
  );
}

export default ProductSkeleton;