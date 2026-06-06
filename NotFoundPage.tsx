import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-[70vh] flex items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        <motion.div
          className="text-8xl mb-6"
          animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
          transition={{ duration: 1.2, delay: 0.3 }}
        >
          😕
        </motion.div>
        <h1 className="text-4xl font-black text-white mb-3">404</h1>
        <p className="text-gray-400 mb-8 max-w-xs mx-auto">
          الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => navigate(-1)} variant="secondary">
            ← رجوع
          </Button>
          <Button onClick={() => navigate('/')}>
            🏠 الرئيسية
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
