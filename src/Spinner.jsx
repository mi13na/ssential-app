function Spinner() {
  return (
    <div className="flex h-screen items-center justify-center bg-neutral-500">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
    </div>
  );
}

export default Spinner;