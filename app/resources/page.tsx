'use client'

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Phone, Heart, Book, Lightbulb, ExternalLink } from 'lucide-react'
import { usePreferences } from '@/contexts/PreferencesContext'

interface Resource {
  title: string;
  description: string;
  link: string;
  category: 'crisis' | 'wellness' | 'education' | 'support';
}

const resources: Resource[] = [
  {
    title: "National Crisis Line",
    description: "24/7 support for those in emotional distress",
    link: "tel:988",
    category: "crisis"
  },
  {
    title: "Mindfulness Exercises",
    description: "Collection of guided mindfulness practices",
    link: "https://www.mindful.org/meditation/mindfulness-getting-started/",
    category: "wellness"
  },
  {
    title: "Mental Health Education",
    description: "Learn about mental health conditions and treatments",
    link: "https://www.nimh.nih.gov/health",
    category: "education"
  },
  {
    title: "Support Groups",
    description: "Find local and online support groups",
    link: "https://www.nami.org/Support-Education/Support-Groups",
    category: "support"
  }
];

const categoryIcons = {
  crisis: Phone,
  wellness: Heart,
  education: Book,
  support: Lightbulb
};

export default function Resources() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { preferences } = usePreferences();

  const filteredResources = selectedCategory
    ? resources.filter(resource => resource.category === selectedCategory)
    : resources;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <motion.h1 
        className="text-3xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Resources & Support
      </motion.h1>

      <motion.div 
        className="flex gap-2 mb-6 overflow-x-auto pb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          onClick={() => setSelectedCategory(null)}
          className="whitespace-nowrap"
        >
          All Resources
        </Button>
        {Object.keys(categoryIcons).map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className="whitespace-nowrap"
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {filteredResources.map((resource, index) => {
          const Icon = categoryIcons[resource.category];
          return (
            <motion.div key={index} variants={item}>
              <Card className="hover-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold mb-2">{resource.title}</h2>
                      <p className="text-muted-foreground mb-4">{resource.description}</p>
                      <a 
                        href={resource.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-primary hover:underline"
                      >
                        Learn More
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Crisis Support Section */}
      <motion.div
        className="mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <Phone className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Need Immediate Support?</h2>
            </div>
            <p className="text-lg mb-4">
              If you're experiencing a mental health crisis or need immediate support:
            </p>
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <span className="font-semibold">• Call 988</span>
                - Suicide and Crisis Lifeline (24/7)
              </p>
              <p className="flex items-center gap-2">
                <span className="font-semibold">• Text HOME to 741741</span>
                - Crisis Text Line (24/7)
              </p>
              <p className="flex items-center gap-2">
                <span className="font-semibold">• Call 911</span>
                - For immediate emergencies
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 