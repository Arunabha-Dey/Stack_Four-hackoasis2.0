export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="relative">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-primary pulse-glow" />
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent pulse-glow" />
      </div>
      <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        Stack Four
      </span>
    </div>
  )
}
