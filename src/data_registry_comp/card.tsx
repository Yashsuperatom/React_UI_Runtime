import React from 'react'

interface CardProps {
  title?: string
  value?: string | number
  trend?: string
  color?: string
}

const DynamicCard: React.FC<CardProps> = ({ title, value, trend, color }) => {
  return (
    <div
      className="p-4 border rounded shadow-sm bg-white dark:bg-gray-800"
      style={{ borderColor: color || undefined }}
    >
      {title && <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-300">{title}</h3>}
      {value && <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>}
      {trend && (
        <span
          className={`text-sm font-medium ${
            trend.includes('-') ? 'text-red-500' : 'text-green-500'
          }`}
        >
          {trend}
        </span>
      )}
    </div>
  )
}

export default DynamicCard
