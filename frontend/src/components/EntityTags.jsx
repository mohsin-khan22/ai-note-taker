import React from 'react'
import { Users, Calendar, Building2, MapPin } from 'lucide-react'

const EntitySection = ({ title, icon: Icon, items, colorClass }) => {
  if (!items || items.length === 0) return null
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs font-bold text-muted uppercase tracking-wider">
        <Icon className="w-3 h-3" />
        {title}
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span key={i} className={`px-2 py-1 rounded-md text-xs font-medium border ${colorClass}`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

const EntityTags = ({ entities }) => {
  return (
    <div className="card h-full space-y-6">
      <h3 className="text-lg font-bold">Detected Entities</h3>
      <div className="space-y-4">
        <EntitySection 
          title="People" 
          icon={Users} 
          items={entities.people} 
          colorClass="bg-primary/10 border-primary/20 text-primary" 
        />
        <EntitySection 
          title="Organizations" 
          icon={Building2} 
          items={entities.organizations} 
          colorClass="bg-secondary/10 border-secondary/20 text-secondary" 
        />
        <EntitySection 
          title="Dates" 
          icon={Calendar} 
          items={entities.dates} 
          colorClass="bg-success/10 border-success/20 text-success" 
        />
        <EntitySection 
          title="Locations" 
          icon={MapPin} 
          items={entities.locations} 
          colorClass="bg-error/10 border-error/20 text-error" 
        />
      </div>
    </div>
  )
}

export default EntityTags
