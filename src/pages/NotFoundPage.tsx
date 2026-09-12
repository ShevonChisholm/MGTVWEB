import { Link } from 'react-router'
import { Button } from '@/components/ui/Button'

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-center px-8 pt-16">
      <div className="mb-6">
        <p className="text-[#C9A84C] text-[120px] leading-none font-bold opacity-20" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
          404
        </p>
        <h1 className="text-4xl md:text-6xl text-[#F5F5F5] -mt-6" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
          Page Not Found
        </h1>
      </div>
      <p className="text-[#A3A3A3] text-base max-w-sm mb-8">
        Looks like this page took a detour. Head back to the home screen and keep exploring.
      </p>
      <Link to="/">
        <Button variant="primary" size="lg">Back to Home</Button>
      </Link>
    </div>
  )
}
