"use client"

import { CreateVoteForm } from "@/components/features/votes/CreateVoteForm"
import { motion } from "framer-motion"

export default function CreateVotePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="mb-8 text-center"
      >
        <h1 className="text-4xl font-bold">Create New Vote</h1>
        <p className="mt-2 text-muted-foreground">Set up a new vote and customize its settings</p>
      </motion.div>
      <CreateVoteForm />
    </div>
  )
}