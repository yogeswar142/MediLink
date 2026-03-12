export default function LoadingSpinner({ message }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-slate-700 border-t-blue-500 animate-spin"></div>
        <div className="absolute inset-0 rounded-full border-4 border-slate-700 border-b-indigo-500 animate-[spin_1.5s_linear_infinite_reverse]"></div>
        <div className="absolute inset-0 w-16 h-16 rounded-full bg-indigo-500/10 card-pulse"></div>
      </div>
      {message && <p className="text-slate-300 font-medium animate-pulse">{message}</p>}
    </div>
  );
}
